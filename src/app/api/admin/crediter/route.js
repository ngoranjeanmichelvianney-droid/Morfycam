// app/api/admin/crediter/route.js
//
// POST /api/admin/crediter — réservé aux admins.
// Body JSON : { utilisateurId: uuid, packId: string, note?: string }

import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifierAdmin } from "@/lib/verifierAdmin";

export async function POST(request) {
  const admin = await verifierAdmin();
  if (!admin) {
    return Response.json({ erreur: "Non autorisé." }, { status: 403 });
  }

  const { utilisateurId, packId, note } = await request.json();

  if (!utilisateurId || !packId) {
    return Response.json(
      { erreur: "utilisateurId et packId sont requis." },
      { status: 400 }
    );
  }

  const { data: demandeId, error } = await supabaseAdmin.rpc(
    "admin_crediter_utilisateur",
    {
      p_utilisateur_id: utilisateurId,
      p_pack_id: packId,
      p_note: note ? `${note} (par ${admin.email})` : `par ${admin.email}`,
    }
  );

  if (error) {
    console.error("Erreur crédit admin :", error);
    return Response.json({ erreur: error.message }, { status: 500 });
  }

  return Response.json({ succes: true, demandeId });
}