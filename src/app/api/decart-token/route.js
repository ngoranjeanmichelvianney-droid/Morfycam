// app/api/decart-token/route.js
//
// Génère un token client Decart de courte durée (10 minutes) à partir
// de ta clé permanente DECART_API_KEY, qui reste côté serveur.
// Le navigateur n'appelle QUE cette route — jamais Decart directement
// avec la vraie clé.
//
// Variable d'environnement requise (.env.local) :
//   DECART_API_KEY=ta_clé_decart_permanente

import { createDecartClient } from "@decartai/sdk";

export async function POST() {
  try {
    const client = createDecartClient({
      apiKey: process.env.DECART_API_KEY,
    });

    // Token éphémère (ek_...), valable ~10 minutes.
    const token = await client.tokens.create();

    return Response.json(token);
  } catch (err) {
    console.error("Erreur génération token Decart :", err);
    return Response.json(
      { erreur: "Impossible de générer le token Decart." },
      { status: 500 }
    );
  }
}