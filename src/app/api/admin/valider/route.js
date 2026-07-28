// app/api/admin/valider/route.js
//
// POST /api/admin/valider — réservé aux admins.
// Body JSON : { demandeId: uuid }
// Valide une demande de recharge déjà soumise par l'utilisateur
// (crée le lot de temps + bonus parrainage éventuel, via la fonction
// valider_recharge existante).

import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifierAdmin } from "@/lib/verifierAdmin";

export async function POST(request) {
  const admin = await verifierAdmin();
  if (!admin) {
    return Response.json({ erreur: "Non autorisé." }, { status: 403 });
  }

  const { demandeId } = await request.json();

  if (!demandeId) {
    return Response.json({ erreur: "demandeId requis." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.rpc("valider_recharge", {
    p_demande_id: demandeId,
  });

  if (error) {
    console.error("Erreur validation demande admin :", error);
    return Response.json({ erreur: error.message }, { status: 500 });
  }

  return Response.json({ succes: true });
}