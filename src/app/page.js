import Logo from "@/components/Logo";

// TODO : remplace par ton vrai numéro WhatsApp business (format
// international, sans le +, ex: 225XXXXXXXXXX) — garde-le synchronisé
// avec la même constante dans app/support/page.js.
const NUMERO_WHATSAPP = "REMPLACER_NUMERO_WHATSAPP";

export default function Home() {
  const usages = [
    {
      title: "Streamers",
      desc: "Anime tes lives sans montrer ton vrai visage.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 000 18M8 8c1.5 1.5 6.5 1.5 8 0M8 16c1.5-1.5 6.5-1.5 8 0" />
        </svg>
      ),
    },
    {
      title: "Gamers",
      desc: "Incarne un personnage pendant tes parties en direct.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="9" rx="4" />
          <path d="M7 12h3M8.5 10.5v3M15 12h.01M17.5 10.5h.01" />
        </svg>
      ),
    },
    {
      title: "Créateurs",
      desc: "Tourne du contenu viral sous une autre identité visuelle.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4 8-4V7" />
        </svg>
      ),
    },
    {
      title: "VTubers",
      desc: "Deviens ton propre avatar, en temps réel.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
      ),
    },
  ];

  const plateformes = ["WhatsApp", "Zoom", "Teams", "TikTok Live", "OBS", "Discord"];

  const etapes = [
    {
      n: "01",
      titre: "Choisis ton visage",
      desc: "Importe une photo ou pioche parmi les avatars proposés. C'est ta nouvelle identité visuelle.",
    },
    {
      n: "02",
      titre: "Lance ta caméra",
      desc: "MorfyCam capte ton flux webcam et applique la transformation image par image, en direct.",
    },
    {
      n: "03",
      titre: "Diffuse partout",
      desc: "Le flux transformé sort comme une caméra virtuelle, utilisable sur n'importe quelle appli vidéo.",
    },
  ];

  const stats = [
    { chiffre: "40ms", label: "latence moyenne" },
    { chiffre: "1080p", label: "qualité de sortie" },
    { chiffre: "6", label: "plateformes compatibles" },
  ];

  const forfaits = [
    {
      nom: "Découverte",
      prix: "Gratuit",
      periode: "",
      desc: "Pour tester la transformation en direct.",
      inclus: ["10 minutes / jour", "1 avatar", "Qualité 720p", "Filigrane MorfyCam"],
      cta: "Commencer gratuitement",
      mis_en_avant: false,
    },
    {
      nom: "Créateur",
      prix: "5 000 F",
      periode: "/ mois",
      desc: "Pour les streamers et créateurs réguliers.",
      inclus: [
        "Temps illimité",
        "5 avatars enregistrés",
        "Qualité 1080p",
        "Sans filigrane",
        "Sortie caméra virtuelle NDI",
      ],
      cta: "Choisir Créateur",
      mis_en_avant: true,
    },
    {
      nom: "Studio",
      prix: "15 000 F",
      periode: "/ mois",
      desc: "Pour les équipes, VTubers pro et agences.",
      inclus: [
        "Tout Créateur, plus :",
        "Avatars illimités",
        "3 comptes liés",
        "Support prioritaire",
        "Accès anticipé aux nouveaux modèles",
      ],
      cta: "Choisir Studio",
      mis_en_avant: false,
    },
  ];

  const moyensPaiement = ["Orange Money", "MTN Mobile Money", "Wave", "Carte bancaire"];

  const faq = [
    {
      q: "Est-ce que ça marche sur téléphone ?",
      r: "Le studio de transformation tourne dans le cloud, donc l'app fonctionne depuis un navigateur mobile. Une appli dédiée arrive bientôt.",
    },
    {
      q: "Mes mouvements sont-ils fidèles ?",
      r: "Oui. Seul le visage change — tes expressions, ta gestuelle et ta voix restent les tiennes.",
    },
    {
      q: "Puis-je changer d'avatar en cours de live ?",
      r: "Oui, tu peux basculer entre plusieurs visages enregistrés sans interrompre ton flux.",
    },
    {
      q: "Comment je paie mon abonnement ?",
      r: "Par Mobile Money (Orange, MTN, Wave) ou carte bancaire, directement depuis ton compte. Le renouvellement est mensuel, résiliable à tout moment.",
    },
    {
      q: "Puis-je changer de forfait en cours de route ?",
      r: "Oui, tu peux passer à un forfait supérieur ou inférieur à tout moment depuis les réglages de ton compte.",
    },
  ];

  const showcase = [
    {
      image: "/marketing/vibe-live.jpg",
      titre: "Libère ta meilleure vibe en Live !",
      desc: "Amuse-toi avec des potes et utilise nos filtres en direct pour des vidéos stylées instantanément.",
    },
    {
      image: "/marketing/transformation.jpg",
      titre: "Change de visage, garde le réalisme.",
      desc: "Découvre la puissance de notre IA photoréaliste. Une transformation bluffante, fluide et de haute qualité.",
    },
    {
      image: "/marketing/creation.jpg",
      titre: "Crée ton buzz, partage le style.",
      desc: "Capture tes meilleurs moments, applique ton style et partage directement sur tes réseaux pour faire le buzz.",
    },
    {
      image: "/marketing/affiliation.jpg",
      titre: "Invite des amis, gagne des minutes 🎁",
      desc: "Ton ami s'inscrit ? Gagne 1 min (pack 4 min), 3 min (pack 10 min) ou 6 min (pack 20 min) offertes — c'est gratuit pour toi.",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes bg-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(
            135deg,
            #000000,
            #020818,
            #03123b,
            #001a4d,
            #000d2e,
            #020c1f,
            #000000
          );
          background-size: 400% 400%;
          animation: bg-shift 12s ease infinite;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .grid-bg::before {
          content: '';
          position: absolute;
          inset: -10%;
          background-image:
            linear-gradient(rgba(0,68,129,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,68,129,0.15) 1px, transparent 1px);
          background-size: 80px 45px;
          animation: grid-drift 25s linear infinite;
        }
        .grid-bg .grid-pulse {
          position: absolute;
          inset: -10%;
          background-image:
            linear-gradient(rgba(70,224,217,0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(70,224,217,0.55) 1px, transparent 1px);
          background-size: 80px 45px;
          animation: grid-drift 25s linear infinite, grid-glow 4s ease-in-out infinite;
        }
        .grid-bg .grid-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 75% 65% at 50% 50%, transparent 35%, #000000e0 100%);
        }
        @keyframes grid-drift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(80px, 45px); }
        }
        @keyframes grid-glow {
          0%, 100% { opacity: 0; }
          50%       { opacity: 1; }
        }

        .nav-link {
          position: relative;
          padding-bottom: 2px;
          color: inherit;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          width: 0; height: 2px;
          background: #1a8fff;
          border-radius: 2px;
          transition: width 0.25s ease;
          box-shadow: 0 0 8px #1a8fff99;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #1a8fff; }
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-50px, 50px) scale(1.1); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(40px, 60px) scale(1.2); }
        }
        .orb-1 {
          position: fixed; top: -150px; left: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,68,129,0.35) 0%, transparent 70%);
          animation: orb-float-1 9s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .orb-2 {
          position: fixed; bottom: -200px; right: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,30,80,0.4) 0%, transparent 70%);
          animation: orb-float-2 13s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .orb-3 {
          position: fixed; top: 40%; left: 55%;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,50,110,0.2) 0%, transparent 70%);
          animation: orb-float-3 11s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
      `}</style>

      <main className="animated-bg relative min-h-screen overflow-hidden text-sand">
        <div className="grid-bg">
          <div className="grid-pulse" />
          <div className="grid-vignette" />
        </div>

        <div className="orb-1" />
        <div className="orb-2" />
        <div className="orb-3" />

        {/* Nav — fixed */}
        <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-2 px-4 py-3 backdrop-blur sm:px-6 sm:py-5 md:px-12"
          style={{ background: "rgba(0,0,0,0.55)", borderBottom: "1px solid rgba(0,68,129,0.2)" }}>
          <div className="scale-90 origin-left sm:scale-100">
            <Logo />
          </div>
          <div className="hidden gap-6 text-sm text-sand-dim lg:flex">
            <a href="#usages" className="nav-link">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="nav-link">Comment ça marche</a>
            <a href="#showcase" className="nav-link">Aperçu</a>
            <a href="#demo" className="nav-link">Démo</a>
            <a href="#telecharger" className="nav-link">Télécharger</a>
            <a href="#tarifs" className="nav-link">Tarifs</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a href="/login" className="whitespace-nowrap text-xs text-sand-dim hover:text-sand transition sm:text-sm">
              Se connecter
            </a>
            <a
              href="/register"
              className="whitespace-nowrap rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-ink hover:opacity-90 transition sm:px-5 sm:py-2 sm:text-sm"
            >
              Commencer
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 grid gap-10 px-6 pt-20 pb-10 md:px-12 md:pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="apparition">
            <span className="inline-flex items-center gap-2 rounded-full border border-mirage/30 bg-mirage/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-mirage">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mirage" />
              En direct maintenant
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-6xl font-bold leading-[1.05] md:text-8xl">
              Ta caméra montre{" "}
              <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-ember via-mirage to-violet animate-[text-shimmer_5s_linear_infinite]">
                ce que tu choisis
              </span>{" "}
              d&apos;être.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-sand-dim">
              Change de visage en temps réel pendant tes lives, tes appels et tes vidéos.
              Tes mouvements restent les tiens — le reste devient ce que tu veux.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-full bg-ember px-8 py-4 text-lg font-semibold text-ink transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_32px_-8px_theme(colors.ember)]"
              >
                Essayer gratuitement
              </a>
              <a
                href="#demo"
                className="rounded-full border border-sand-dim/40 px-8 py-4 text-lg font-semibold transition hover:border-mirage hover:text-mirage"
              >
                Voir la démo
              </a>
            </div>
            <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-sand-dim/15 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-mono text-3xl font-bold text-mirage md:text-4xl">{s.chiffre}</p>
                  <p className="mt-1 text-xs text-sand-dim">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="apparition relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center lg:flex">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-mirage/20 via-violet/10 to-ember/20 blur-2xl" />
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-mirage/25 shadow-[0_0_60px_-15px_theme(colors.mirage)]">
              <img src="/hero/mirror-scene.jpg" alt="Transformation MorfyCam en direct" className="h-full w-full object-cover" />
            </div>
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-mirage/30 bg-ink/80 px-3 py-1.5 text-[11px] text-mirage backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mirage" />
              en direct
            </span>
          </div>
        </section>

        <svg className="relative z-10 mirage-divider" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,0 300,40 450,20 C600,0 750,40 900,20 C1050,0 1150,40 1200,20" fill="none" stroke="url(#gradient)" strokeWidth="2" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#46E0D9" />
              <stop offset="100%" stopColor="#4B3FA8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Usages */}
        <section id="usages" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            Fait pour{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-jaune via-ember to-mirage animate-[text-shimmer_5s_linear_infinite]">
              toi
            </span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usages.map((u, i) => {
              const styles = [
                { carte: "hover:border-mirage/50 hover:shadow-[0_0_30px_-12px_theme(colors.mirage)]", texte: "text-mirage" },
                { carte: "hover:border-ember/50 hover:shadow-[0_0_30px_-12px_theme(colors.ember)]", texte: "text-ember" },
                { carte: "hover:border-jaune/50 hover:shadow-[0_0_30px_-12px_theme(colors.jaune)]", texte: "text-jaune" },
                { carte: "hover:border-violet/50 hover:shadow-[0_0_30px_-12px_theme(colors.violet)]", texte: "text-violet" },
              ];
              const style = styles[i % styles.length];
              return (
                <div key={u.title} className={`rounded-2xl border border-sand-dim/15 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 ${style.carte}`}>
                  <div className={style.texte}>{u.icon}</div>
                  <h3 className={`mt-4 font-display text-2xl italic ${style.texte}`}>{u.title}</h3>
                  <p className="mt-2 text-sm text-sand-dim">{u.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Showcase */}
        <section id="showcase" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            L&apos;expérience{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-jaune to-ember animate-[text-shimmer_5s_linear_infinite]">
              MorfyCam
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-lg text-sand-dim">Du fun instantané à la viralité — voilà à quoi ressemble MorfyCam en vrai.</p>
          <div className="mt-14 space-y-24">
            {showcase.map((item, i) => {
              const imageADroite = i % 2 === 1;
              const degrades = [
                "from-mirage via-jaune to-ember",
                "from-ember via-violet to-mirage",
                "from-jaune via-mirage to-violet",
                "from-violet via-ember to-jaune",
              ];
              const degrade = degrades[i % degrades.length];
              return (
                <div key={item.titre} className="grid items-center gap-8 md:grid-cols-2 md:gap-16 animate-[fade-up_0.7s_ease-out_both]">
                  <div className={`overflow-hidden rounded-2xl border border-sand-dim/15 transition-all duration-300 hover:scale-[1.02] hover:border-mirage/60 hover:shadow-[0_0_40px_-12px_theme(colors.mirage)] ${imageADroite ? "md:order-2" : "md:order-1"}`}>
                    <img src={item.image} alt={item.titre} className="aspect-[4/5] w-full object-cover sm:aspect-[3/4]" />
                  </div>
                  <div className={imageADroite ? "md:order-1" : "md:order-2"}>
                    <h3 className={`bg-[length:200%_auto] bg-clip-text font-display text-4xl font-bold italic text-transparent bg-gradient-to-r ${degrade} animate-[text-shimmer_5s_linear_infinite] md:text-5xl`}>{item.titre}</h3>
                    <p className="mt-5 max-w-md text-lg text-sand-dim">{item.desc}</p>
                    <a href="/register" className="mt-7 inline-block rounded-full border border-mirage/40 px-7 py-3 text-sm font-medium transition-all duration-200 hover:border-mirage hover:bg-mirage/10 hover:text-mirage hover:shadow-[0_0_24px_-8px_theme(colors.mirage)]">
                      Essayer maintenant
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="comment-ca-marche" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            Comment ça{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-violet via-mirage to-jaune animate-[text-shimmer_5s_linear_infinite]">
              marche
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-lg text-sand-dim">Trois étapes, aucune installation lourde, un résultat en direct.</p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {etapes.map((e) => (
              <div key={e.n} className="relative rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-6">
                <span className="font-mono text-2xl font-bold text-violet">{e.n}</span>
                <h3 className="mt-3 font-display text-3xl italic">{e.titre}</h3>
                <p className="mt-2 text-sand-dim">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Démo — emplacement pour la vidéo de démonstration.
            Remplace le <div> ci-dessous par une balise <video> une fois
            ton fichier prêt, par exemple :
            <video src="/demo/morfycam-demo.mp4" controls className="w-full rounded-xl" />
        */}
        <section id="demo" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            Voir MorfyCam en{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-ember via-jaune to-mirage animate-[text-shimmer_5s_linear_infinite]">
              action
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-lg text-sand-dim">Un aperçu de la transformation en direct, avant / après.</p>
          <div className="mt-10 flex aspect-video w-full max-w-3xl items-center justify-center rounded-2xl border border-dashed border-sand-dim/25 bg-white/5 backdrop-blur-sm">
            <p className="text-sm text-sand-dim">Vidéo de démonstration à venir</p>
          </div>
        </section>

        {/* Plateformes */}
        <section id="plateformes" className="relative z-10 apparition px-6 py-16 md:px-12">
          <p className="font-mono text-xs uppercase tracking-widest text-sand-dim">Fonctionne avec</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {plateformes.map((p) => (
              <span key={p} className="font-display text-xl italic text-sand-dim">{p}</span>
            ))}
          </div>
        </section>

        {/* Télécharger */}
        <section id="telecharger" className="relative z-10 apparition px-6 py-20 md:px-12">
          <div className="rounded-2xl border border-mirage/25 bg-white/5 backdrop-blur-sm p-8 text-center shadow-[0_0_40px_-15px_theme(colors.mirage)] md:p-12">
            <h2 className="font-display text-4xl font-bold italic md:text-5xl">
              Emmène{" "}
              <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-ember to-violet animate-[text-shimmer_5s_linear_infinite]">
                MorfyCam
              </span>{" "}
              partout
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sand-dim">
              L&apos;app fonctionne déjà depuis ton navigateur, sur ordinateur comme sur mobile.
              Une version installable arrive bientôt.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="/register" className="rounded-full bg-ember px-7 py-3 font-medium text-ink transition hover:opacity-90">
                Utiliser dans le navigateur
              </a>
              <span className="rounded-full border border-sand-dim/30 px-6 py-3 text-sm text-sand-dim">
                App iOS / Android — bientôt
              </span>
            </div>
          </div>
        </section>

        {/* Tarifs */}
        <section id="tarifs" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            Nos{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-jaune via-violet to-mirage animate-[text-shimmer_5s_linear_infinite]">
              tarifs
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-lg text-sand-dim">Paiement par Mobile Money ou carte, sans engagement.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {forfaits.map((f) => (
              <div
                key={f.nom}
                className={`rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm ${
                  f.mis_en_avant
                    ? "border-mirage bg-white/10 shadow-[0_0_36px_-10px_theme(colors.mirage)]"
                    : "border-sand-dim/15 bg-white/5"
                }`}
              >
                {f.mis_en_avant && (
                  <span className="mb-3 w-fit rounded-full bg-gradient-to-r from-mirage to-violet px-3 py-1 text-xs font-semibold text-ink">
                    Le plus choisi
                  </span>
                )}
                <h3 className="font-display text-2xl italic">{f.nom}</h3>
                <p className="mt-1 text-sm text-sand-dim">{f.desc}</p>
                <p className="mt-4">
                  <span className="font-mono text-3xl font-bold text-mirage">{f.prix}</span>
                  <span className="text-sm text-sand-dim">{f.periode}</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-sand-dim flex-1">
                  {f.inclus.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-mirage">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-medium transition ${
                    f.mis_en_avant
                      ? "bg-gradient-to-r from-mirage to-violet text-ink hover:opacity-90"
                      : "border border-sand-dim/40 hover:border-mirage hover:text-mirage"
                  }`}
                >
                  {f.cta}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sand-dim/15 pt-6">
            <span className="font-mono text-xs uppercase tracking-widest text-sand-dim">Paiement accepté</span>
            {moyensPaiement.map((m) => (
              <span key={m} className="text-sm text-sand-dim">{m}</span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative z-10 apparition px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold italic md:text-6xl">
            Questions{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-ember to-violet animate-[text-shimmer_5s_linear_infinite]">
              fréquentes
            </span>
          </h2>
          <div className="mt-10 max-w-2xl divide-y divide-sand-dim/15">
            {faq.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl italic">
                  {item.q}
                  <span className="ml-4 text-mirage transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sand-dim">{item.r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="relative z-10 apparition px-6 py-28 text-center md:px-12">
          <h2 className="mx-auto max-w-3xl font-display text-5xl font-bold italic md:text-7xl">
            Prêt à devenir{" "}
            <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-ember via-jaune to-violet animate-[text-shimmer_5s_linear_infinite]">
              quelqu&apos;un d&apos;autre
            </span>{" "}
            ?
          </h2>
          <a
            href="/register"
            className="mt-10 inline-block rounded-full bg-ember px-10 py-4 text-lg font-semibold text-ink transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_32px_-8px_theme(colors.ember)]"
          >
            Créer mon compte
          </a>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-sand-dim/10 px-6 py-12 md:px-12" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo taille={22} />
              <p className="mt-2 text-sm text-sand-dim">La transformation faciale en direct, pour tous les créateurs.</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sand-dim">Produit</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#comment-ca-marche" className="text-sand-dim hover:text-sand transition">Comment ça marche</a></li>
                <li><a href="#demo" className="text-sand-dim hover:text-sand transition">Démo</a></li>
                <li><a href="#tarifs" className="text-sand-dim hover:text-sand transition">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sand-dim">Aide</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#faq" className="text-sand-dim hover:text-sand transition">FAQ</a></li>
                <li><a href="/support" className="text-sand-dim hover:text-sand transition">Support</a></li>
                <li>
                  <a
                    href={`https://wa.me/${NUMERO_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sand-dim hover:text-sand transition"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sand-dim">Légal</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="/conditions-utilisation" className="text-sand-dim hover:text-sand transition">Conditions d&apos;utilisation</a></li>
                <li><a href="/confidentialite" className="text-sand-dim hover:text-sand transition">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t border-sand-dim/10 pt-6 text-xs text-sand-dim">
            MorfyCam — 2026. Disponible en Afrique de l&apos;Ouest et Centrale.
          </p>
        </footer>
      </main>
    </>
  );
}