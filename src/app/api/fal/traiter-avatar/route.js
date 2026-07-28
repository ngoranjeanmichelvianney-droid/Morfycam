import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(request) {
  try {
    const { imageDataUrl, enleverFond, style } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json({ erreur: "Image manquante." }, { status: 400 });
    }

    // fal attend une URL, pas du base64 brut — on upload d'abord
    // l'image reçue vers le stockage fal pour obtenir une URL exploitable.
    const blob = await (await fetch(imageDataUrl)).blob();
    let urlImageActuelle = await fal.storage.upload(blob);

    // 1. Amélioration de qualité — toujours appliquée automatiquement,
    // ce n'est pas une option proposée à l'utilisateur.
    // Note : l'identifiant du modèle est "clarityai/crystal-upscaler"
    // (pas "fal-ai/crystal-upscaler") — vérifié dans le Playground fal.ai.
    const resultatQualite = await fal.subscribe("clarityai/crystal-upscaler", {
      input: { image_url: urlImageActuelle },
    });
    urlImageActuelle = resultatQualite.data.image.url;

    // 2. Suppression du fond — seulement si demandé.
    if (enleverFond) {
      const resultatFond = await fal.subscribe("fal-ai/bria/background/remove", {
        input: { image_url: urlImageActuelle },
      });
      urlImageActuelle = resultatFond.data.image.url;
    }

    // 3. Effet stylisé — seulement si un style a été choisi.
    if (style) {
      const resultatStyle = await fal.subscribe("fal-ai/image-editing/style-transfer", {
        input: { image_url: urlImageActuelle, prompt: style },
      });
      urlImageActuelle = resultatStyle.data.image.url;
    }

    return NextResponse.json({ url: urlImageActuelle });
  } catch (erreur) {
    console.error("Erreur traitement avatar fal.ai :", erreur);
    return NextResponse.json({ erreur: "Le traitement a échoué." }, { status: 500 });
  }
}