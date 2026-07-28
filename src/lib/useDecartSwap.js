// lib/useDecartSwap.js
//
// Connecte un flux caméra (MediaStream) au SDK temps réel de Decart et
// retourne le client pour pouvoir mettre à jour le prompt / l'image de
// référence en cours de session, ou couper la connexion.
//
// SÉCURITÉ :
// La vraie clé DECART_API_KEY ne quitte jamais le serveur. Ce module
// appelle /api/decart-token, une route serveur qui génère un token
// éphémère (~10 min) à partir de la clé permanente. Le navigateur ne
// manipule que ce token de courte durée.

import { createDecartClient, models } from "@decartai/sdk";

/** Récupère un token client éphémère depuis notre route serveur. */
async function obtenirTokenEphemere() {
  const reponse = await fetch("/api/decart-token", { method: "POST" });
  if (!reponse.ok) {
    throw new Error("Impossible d'obtenir le token Decart depuis le serveur.");
  }
  return reponse.json(); // { token: "ek_...", ... }
}

/**
 * @param {MediaStream} stream - flux caméra obtenu via getUserMedia
 * @param {string} avatarUrl - image de référence (dataURL ou URL publique)
 * @param {(fluxEdite: MediaStream) => void} onFluxEdite - callback appelé
 *        avec le flux vidéo transformé, à brancher sur un <video>
 * @param {{ modelId?: string }} [options]
 */
export async function connecterDecart(
  stream,
  avatarUrl,
  onFluxEdite,
  options = {}
) {
  const { modelId = "lucy-2.5", prompt, enhance = true } = options;

  const { token } = await obtenirTokenEphemere();
  const client = createDecartClient({ apiKey: token });
  const model = models.realtime(modelId);

  const realtimeClient = await client.realtime.connect(stream, {
    model,
    mirror: "auto",
    onRemoteStream: (fluxEdite) => onFluxEdite(fluxEdite),
    initialState: {
      image: avatarUrl,
      // Le prompt explicite + enhance améliorent nettement la fidélité
      // du rendu par rapport à `image` seul.
      prompt: {
        text: prompt || "Transforme le sujet pour qu'il ressemble à l'image de référence",
        enhance,
      },
    },
  });

  return realtimeClient;
}

/** Met à jour uniquement le texte du prompt en cours de session. */
export function mettreAJourPrompt(realtimeClient, texte) {
  return realtimeClient?.setPrompt?.(texte);
}

/** Change le visage cible en cours de session (identité). */
export function mettreAJourAvatar(realtimeClient, avatarUrl, texte) {
  return realtimeClient?.set?.({
    image: avatarUrl,
    ...(texte ? { prompt: { text: texte } } : {}),
  });
}

/** Coupe proprement la connexion temps réel. */
export function deconnecterDecart(realtimeClient) {
  return realtimeClient?.disconnect?.();
}