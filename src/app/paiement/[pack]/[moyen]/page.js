// app/paiement/[pack]/[moyen]/page.jsx
//
// Étape 3 (opérateurs manuels uniquement — Wave saute directement à la
// confirmation) : affiche le numéro à créditer, et le bouton
// "Confirmer" crée la demande en base avant de passer à l'étape 4.

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { trouverOffre, OPERATEURS_MANUELS } from "@/lib/paiementConfig";

export default function InstructionsPaiement() {
  const router = useRouter();
  const { pack, moyen } = useParams();
  const offre = trouverOffre(pack);
  const operateur = OPERATEURS_MANUELS[moyen];

  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);

  if (!offre || !operateur) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2b2420] px-6 text-center text-sand">
        <div>
          <p className="text-sand-dim">Pack ou moyen de paiement introuvable.</p>
          <a href="/paiement" className="mt-2 inline-block text-mirage hover:opacity-70">
            ← Recommencer
          </a>
        </div>
      </main>
    );
  }

  async function confirmer() {
    setEnCours(true);
    setErreur(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Tu dois être connecté pour recharger.");

      const { error } = await supabase.from("demandes_recharge").insert({
        utilisateur_id: user.id,
        pack_id: offre.id,
        montant_fcfa: offre.prix,
        moyen_paiement: operateur.moyenPaiementLabel,
      });
      if (error) throw error;

      router.push(`/paiement/${offre.id}/confirmation?moyen=${operateur.moyenPaiementLabel}`);
    } catch (err) {
      console.error("Erreur création demande :", err);
      setErreur("Impossible d'enregistrer ta demande. Réessaie.");
      setEnCours(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#2b2420] text-sand">
      <section className="mx-auto max-w-2xl px-6 py-16 md:px-0">
        <a
          href={`/paiement/${offre.id}/reseau`}
          className="text-sm text-sand-dim transition hover:text-sand"
        >
          ← Changer de réseau
        </a>

        <div className="mt-8 rounded-2xl border border-sand-dim/20 bg-umber/60 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-ink ring-1 ring-sand-dim/15">
              <img src={operateur.logo} alt={operateur.nom} className="h-full w-full object-cover" />
            </div>
            <p className="font-display text-2xl italic">{operateur.nom}</p>
          </div>

          <p className="mt-4 text-sm text-sand-dim">
            Envoie <span className="font-mono font-bold text-sand">{offre.uniteFCFA}</span> au
            numéro :
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-mirage">{operateur.numero}</p>

          <button
            onClick={confirmer}
            disabled={enCours}
            className="mt-6 w-full rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {enCours ? "Enregistrement…" : "J'ai payé — Confirmer"}
          </button>

          {erreur && (
            <p className="mt-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2 text-sm text-ember">
              {erreur}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}