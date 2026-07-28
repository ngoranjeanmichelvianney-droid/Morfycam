// app/api/admin/historique/route.js
//
// GET /api/admin/historique — réservé aux admins.
// Retourne les 100 dernières demandes qui ne sont plus "en_attente"
// (validées, manuelles, expirées, en erreur), triées de la plus
// récente à la plus ancienne.

import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifierAdmin } from "@/lib/verifierAdmin";

export async function GET() {
  const admin = await verifierAdmin();
  if (!admin) {
    return Response.json({ erreur: "Non autorisé." }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.rpc("admin_lister_historique", {
    p_limite: 100,
  });

  if (error) {
    console.error("Erreur historique admin :", error);
    return Response.json({ erreur: "Erreur serveur." }, { status: 500 });
  }

  return Response.json(data || []);
}