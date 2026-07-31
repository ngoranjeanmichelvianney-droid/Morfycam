// app/paiement/page.jsx
//
// Étape 1 : choisir un pack. Chaque carte est un lien direct vers
// /paiement/[pack]/reseau — pas de gestion d'état ici, donc Server
// Component simple.

import { OFFRES } from "@/lib/paiementConfig";

export default function Paiement() {
  return (
    <main className="min-h-screen bg-[#2b2420] text-sand">
      <section className="mx-auto max-w-2xl px-6 py-16 md:px-0">
        <a href="/dashboard" className="text-sm text-sand-dim transition hover:text-sand">
          ← Retour au dashboard
        </a>

        <h1 className="mt-6 bg-[length:200%_auto] bg-gradient-to-r from-mirage via-ember to-mirage bg-clip-text font-display text-4xl font-bold italic text-transparent animate-[text-shimmer_5s_linear_infinite] md:text-5xl">
          Recharger mon temps
        </h1>

        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-mirage">
          1. Choisis ton pack
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {OFFRES.map((o) => (
            <a
              key={o.id}
              href={`/paiement/${o.id}/reseau`}
              className="rounded-xl border border-sand-dim/20 p-4 text-left transition-all duration-200 hover:border-mirage/50 hover:bg-mirage/5"
            >
              <p className="font-display text-lg italic">{o.titre}</p>
              <p className="font-mono text-xl font-bold text-mirage">{o.uniteFCFA}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}