// TODO : remplace ces valeurs par tes vraies informations, et garde-les
// synchronisées avec NUMERO_WHATSAPP dans app/support/page.js.
const NUMERO_WHATSAPP = "REMPLACER_NUMERO_WHATSAPP";
const EMAIL_SUPPORT = "support@morfycam.com";

// Liens de paiement Wave Business, un lien par forfait (générés depuis ton
// espace Wave Business — un lien = un prix fixe).
const LIENS_WAVE = {
  Créateur: "REMPLACER_LIEN_WAVE_CREATEUR",
  Studio: "REMPLACER_LIEN_WAVE_STUDIO",
};

const AUTRES_MOYENS_PAIEMENT = [
  { nom: "Orange Money", numero: "REMPLACER_NUMERO_ORANGE", couleur: "#FF7900" },
  { nom: "MTN Mobile Money", numero: "REMPLACER_NUMERO_MTN", couleur: "#FFCC00" },
  { nom: "Moov Money", numero: "REMPLACER_NUMERO_MOOV", couleur: "#0072CE" },
];

const FORFAITS = [
  { nom: "Créateur", prix: "5 000 F", periode: "/ mois" },
  { nom: "Studio", prix: "15 000 F", periode: "/ mois" },
];

export default function Paiement() {
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#808080" }}>
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-0">
        <a href="/" className="text-sm text-white/80 transition hover:text-white">
          ← Retour à l&apos;accueil
        </a>

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/70">
          Recharger mon compte
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold italic text-white md:text-5xl">
          Comment payer ton pack
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Le paiement se fait en 3 étapes simples. Ton temps est crédité
          manuellement après vérification.
        </p>

        {/* Paiement Wave — un lien par forfait */}
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-white/70">
          Payer avec Wave (le plus rapide)
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FORFAITS.map((f) => (
            <a
              key={f.nom}
              href={LIENS_WAVE[f.nom]}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/25 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
              style={{ borderLeft: "4px solid #00D9A3" }}
            >
              <p className="font-display text-xl italic text-white">{f.nom}</p>
              <p className="mt-1">
                <span className="font-mono text-2xl font-bold text-white">{f.prix}</span>
                <span className="text-sm text-white/85">{f.periode}</span>
              </p>
              <p className="mt-3 text-sm text-white/85">
                Paie directement via ce lien Wave — ton temps est crédité
                dès réception du paiement.
              </p>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/70">
          Après un paiement Wave, envoie-nous quand même une capture de la
          confirmation via WhatsApp ou e-mail avec l&apos;adresse de ton
          compte, pour accélérer le crédit de ton temps.
        </p>

        {/* Autres opérateurs — transfert manuel */}
        <p className="mt-14 font-mono text-xs uppercase tracking-widest text-white/70">
          Payer avec Orange Money, MTN ou Moov
        </p>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-display text-xl italic text-white">1. Transfère le montant</p>
            <p className="mt-1 text-sm text-white/85">
              Envoie le montant du pack choisi vers l&apos;un des comptes
              ci-dessous, selon l&apos;opérateur que tu utilises.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-display text-xl italic text-white">2. Envoie ta preuve de paiement</p>
            <p className="mt-1 text-sm text-white/85">
              Fais une capture d&apos;écran de la confirmation de transfert et
              envoie-la nous via WhatsApp ou par e-mail, avec l&apos;adresse
              e-mail de ton compte MorfyCam.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-display text-xl italic text-white">3. Reçois ton temps</p>
            <p className="mt-1 text-sm text-white/85">
              Après vérification, ton temps est crédité manuellement sur ton
              compte, généralement sous peu de temps.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {AUTRES_MOYENS_PAIEMENT.map((m) => (
            <div
              key={m.nom}
              className="rounded-2xl border border-white/25 bg-white/10 p-5"
              style={{ borderLeft: `4px solid ${m.couleur}` }}
            >
              <p className="font-display text-xl italic text-white">{m.nom}</p>
              <p className="mt-1 font-mono text-lg text-white/90">{m.numero}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/70">
          Vérifie bien le nom du bénéficiaire affiché avant de valider ton
          transfert.
        </p>

        {/* Envoyer la preuve */}
        <p className="mt-14 font-mono text-xs uppercase tracking-widest text-white/70">
          Envoyer ma preuve de paiement
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href={`https://wa.me/${NUMERO_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/30 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
          >
            <p className="font-display text-2xl italic text-white">WhatsApp</p>
            <p className="mt-2 text-sm text-white/85">
              Le canal le plus rapide pour un crédit express.
            </p>
          </a>
          <a
            href={`mailto:${EMAIL_SUPPORT}`}
            className="rounded-2xl border border-white/30 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
          >
            <p className="font-display text-2xl italic text-white">Email</p>
            <p className="mt-2 text-sm text-white/85">{EMAIL_SUPPORT}</p>
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
          <p className="text-white/90">
            Un souci avec ta recharge ?{" "}
            <a href="/support" className="text-white underline underline-offset-2 hover:opacity-80">
              Contacte le support
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}