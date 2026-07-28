// app/api/send-welcome/route.js
import { sendWelcomeEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, prenom } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email manquant" }, { status: 400 });
    }

    await sendWelcomeEmail({
      to: email,
      prenom: prenom || "toi",
      lienApp: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email bienvenue:", err);
    // On ne bloque jamais l'inscription si l'email échoue
    return NextResponse.json({ success: false }, { status: 200 });
  }
}