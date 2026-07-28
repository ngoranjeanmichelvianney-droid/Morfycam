// TODO : remplace par ton vrai numéro WhatsApp business (format international,
// sans le +, ex: 225XXXXXXXXXX) et ton vrai email de support.
const NUMERO_WHATSAPP = "REMPLACER_NUMERO_WHATSAPP";
const EMAIL_SUPPORT = "support@morfycam.com";

export default function Support() {
  const categories = [
    {
      titre: "Paiement & recharge",
      desc: "Ma recharge n'a pas été créditée, je veux changer de moyen de paiement, problème de facturation.",
    },
    {
      titre: "Compte & connexion",
      desc: "Mot de passe oublié, changer d'email, supprimer mon compte.",
    },
    {
      titre: "Problème technique",
      desc: "Caméra qui ne se lance pas, transformation qui ne fonctionne pas, latence.",
    },
    {
      titre: "Parrainage",
      desc: "Mon lien de parrainage, mes minutes gagnées, un ami qui n'a pas été crédité.",
    },
  ];

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#808080" }}>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .apparition { animation: fade-up 0.6s ease-out both; }
      `}</style>

      <section className="apparition mx-auto max-w-3xl px-6 py-16 md:px-0">
        <a href="/" className="text-sm text-white/80 transition hover:text-white">
          ← Retour à l&apos;accueil
        </a>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/70">
          Besoin d&apos;aide ?
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold italic text-white md:text-6xl">
          Le support MorfyCam
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Une question sur ton compte, un paiement, ou un souci technique ?
          Contacte-nous directement, on répond vite.
        </p>

        {/* Canaux de contact */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`https://wa.me/${NUMERO_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/30 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
          >
            <p className="font-display text-2xl italic text-white">WhatsApp</p>
            <p className="mt-2 text-sm text-white/85">
              Le canal le plus rapide — réponse généralement en quelques
              minutes aux heures ouvrées.
            </p>
          </a>
          <a
            href={`mailto:${EMAIL_SUPPORT}`}
            className="rounded-2xl border border-white/30 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
          >
            <p className="font-display text-2xl italic text-white">Email</p>
            <p className="mt-2 text-sm text-white/85">{EMAIL_SUPPORT}</p>
            <p className="mt-1 text-sm text-white/85">
              Pour les demandes plus détaillées, réponse sous 24-48h.
            </p>
          </a>
        </div>

        {/* Catégories fréquentes */}
        <p className="mt-14 font-mono text-xs uppercase tracking-widest text-white/70">
          Sujets fréquents
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.titre}
              className="rounded-2xl border border-white/20 bg-white/10 p-5"
            >
              <h3 className="font-display text-xl italic text-white">{c.titre}</h3>
              <p className="mt-1 text-sm text-white/85">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
          <p className="text-white/90">
            Beaucoup de réponses se trouvent déjà dans notre{" "}
            <a href="/#faq" className="text-white underline underline-offset-2 hover:opacity-80">
              FAQ
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}