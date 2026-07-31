// app/paiement/[pack]/reseau/page.jsx
//
// Étape 2 : choisir le réseau. Wave crée directement la demande et
// ouvre le lien de paiement. Les opérateurs manuels redirigent vers
// /paiement/[pack]/[moyen] pour afficher les instructions.

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { trouverOffre, MOYENS_PAIEMENT, LIENS_WAVE } from "@/lib/paiementConfig";

export default function ChoixReseau() {
  const router = useRouter();
  const { pack } = useParams();
  const offre = trouverOffre(pack);

  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);

  if (!offre) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2b2420] px-6 text-center text-sand">
        <div>
          <p className="text-sand-dim">Pack introuvable.</p>
          <a href="/paiement" className="mt-2 inline-block text-mirage hover:opacity-70">
            ← Choisir un pack
          </a>
        </div>
      </main>
    );
  }

  async function choisirReseau(id) {
    if (id === "wave") {
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
          moyen_paiement: "Wave",
        });
        if (error) throw error;

        window.open(LIENS_WAVE[offre.id], "_blank", "noopener,noreferrer");
        router.push(`/paiement/${offre.id}/confirmation?moyen=Wave`);
      } catch (err) {
        console.error("Erreur création demande Wave :", err);
        setErreur("Impossible d'enregistrer ta demande. Réessaie.");
        setEnCours(false);
      }
      return;
    }

    router.push(`/paiement/${offre.id}/${id}`);
  }

  return (
    <main className="min-h-screen bg-[#2b2420] text-sand">
      <section className="mx-auto max-w-2xl px-6 py-16 md:px-0">
        <a
          href="/paiement"
          className="text-sm text-sand-dim transition hover:text-sand"
        >
          ← Changer de pack
        </a>

        <div className="mt-6 rounded-xl border border-mirage/30 bg-mirage/5 p-4">
          <p className="text-xs text-sand-dim">Pack sélectionné</p>
          <p className="font-display text-xl italic text-mirage">
            {offre.titre} — {offre.uniteFCFA}
          </p>
        </div>

        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-ember">
          2. Choisis ton réseau
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {MOYENS_PAIEMENT.map((m) => (
            <button
              key={m.id}
              onClick={() => !m.bientot && choisirReseau(m.id)}
              disabled={m.bientot || enCours}
              className={`flex flex-col items-center gap-2 rounded-xl border border-sand-dim/20 p-3 text-center transition-all duration-200 hover:border-mirage/50 ${
                m.bientot ? "cursor-not-allowed opacity-40" : ""
              } ${enCours ? "opacity-60" : ""}`}
            >
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-ink ring-1 ring-sand-dim/15">
                <img src={m.logo} alt={m.nom} className="h-full w-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-sand-dim">
                {m.bientot ? "Bientôt" : m.nom}
              </span>
            </button>
          ))}
        </div>

        {enCours && (
          <p className="mt-4 text-sm text-sand-dim">Enregistrement en cours…</p>
        )}
        {erreur && (
          <p className="mt-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2 text-sm text-ember">
            {erreur}
          </p>
        )}
      </section>
    </main>
  );
}