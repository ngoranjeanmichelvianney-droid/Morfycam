// app/api/auth/signup/route.ts
// Exemple : inscription via Supabase Auth, PUIS envoi de l'email de bienvenue via Resend
// (Supabase gère lui-même l'email de vérification natif si tu utilises signUp(),
//  mais tu peux aussi le désactiver et gérer 100% avec Resend, voir note plus bas)

import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/emails/send';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // clé serveur, jamais côté client
);

export async function POST(req: Request) {
  const { email, password, prenom } = await req.json();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // false = Supabase enverra son propre email de confirmation
    user_metadata: { prenom },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Email de bienvenue custom via Resend, en plus de la confirmation Supabase
  await sendWelcomeEmail({
    to: email,
    prenom,
    lienDashboard: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({ user: data.user });
}