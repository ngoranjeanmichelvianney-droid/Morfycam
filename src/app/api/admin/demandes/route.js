// app/api/admin/demandes/route.js
//
// GET /api/admin/demandes — réservé aux admins.
// Retourne toutes les demandes de recharge en statut "en_attente",
// avec l'e-mail de l'utilisateur, triées de la plus ancienne à la
// plus récente.

import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifierAdmin } from "@/lib/verifierAdmin";

export async function GET() {
  const admin = await verifierAdmin();
  if (!admin) {
    return Response.json({ erreur: "Non autorisé." }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.rpc(
    "admin_lister_demandes_en_attente"
  );

  if (error) {
    console.error("Erreur liste demandes admin :", error);
    return Response.json({ erreur: "Erreur serveur." }, { status: 500 });
  }

  return Response.json(data || []);
}