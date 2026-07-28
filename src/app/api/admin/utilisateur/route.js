// app/api/admin/utilisateur/route.js
//
// GET /api/admin/utilisateur?email=... — réservé aux admins
// (voir lib/verifierAdmin.js et ADMIN_EMAILS dans .env.local).
// L'authentification passe par le cookie de session (pas de header
// à gérer côté client, le navigateur l'envoie automatiquement).

import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifierAdmin } from "@/lib/verifierAdmin";

export async function GET(request) {
  const admin = await verifierAdmin();
  if (!admin) {
    return Response.json({ erreur: "Non autorisé." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ erreur: "Paramètre email requis." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.rpc("admin_chercher_utilisateur", {
    p_email: email,
  });

  if (error) {
    console.error("Erreur recherche utilisateur admin :", error);
    return Response.json({ erreur: "Erreur serveur." }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return Response.json({ erreur: "Aucun utilisateur avec cet e-mail." }, { status: 404 });
  }

  return Response.json(data[0]);
}