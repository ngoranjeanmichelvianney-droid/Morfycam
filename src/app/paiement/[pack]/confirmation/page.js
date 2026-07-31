// app/paiement/[pack]/confirmation/page.jsx
//
// Étape 4 : la demande est déjà en base à ce stade (créée par l'étape
// précédente). On affiche juste le récap + le lien WhatsApp pré-rempli
// pour envoyer la preuve. Pas d'appel réseau ici, donc Server Component.

import { trouverOffre, NUMERO_WHATSAPP } from "@/lib/paiementConfig";

export default async function Confirmation({ params, searchParams }) {
  const { pack } = await params;
  const { moyen } = await searchParams;

  const offre = trouverOffre(pack);

  if (!offre) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2b2420] px-6 text-center text-sand">
        <div>
          <p className="text-sand-dim">Pack introuvable.</p>
          <a href="/paiement" className="mt-2 inline-block text-mirage hover:opacity-70">
            ← Recommencer
          </a>
        </div>
      </main>
    );
  }

  const nomMoyen = moyen || "ton moyen de paiement";
  const lienWhatsAppPreuve = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
    `Bonjour, je viens de payer ${offre.uniteFCFA} pour le ${offre.titre} via ${nomMoyen}. Voici ma preuve de paiement.`
  )}`;

  return (
    <main className="min-h-screen bg-[#2b2420] text-sand">
      <section className="mx-auto max-w-2xl px-6 py-16 md:px-0">
        <div className="animate-[fade-up_0.3s_ease-out] rounded-2xl border border-mirage/30 bg-mirage/5 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mirage/15 text-3xl text-mirage">
            ✓
          </span>
          <p className="mt-4 font-display text-2xl italic">Demande enregistrée</p>
          <p className="mt-2 text-sm text-sand-dim">
            {offre.titre} — {offre.uniteFCFA} via {nomMoyen}
          </p>
          <p className="mt-4 text-sm text-sand-dim">
            Dernière étape : envoie la capture d&apos;écran de ta confirmation
            de paiement sur WhatsApp — ton temps sera crédité après
            vérification.
          </p>
          <a
            href={lienWhatsAppPreuve}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-mirage to-ember px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90"
          >
            Envoyer ma preuve sur WhatsApp
          </a>
          <div>
            <a
              href="/dashboard"
              className="mt-4 inline-block text-sm text-sand-dim hover:text-sand"
            >
              Retour au dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}