// ⚠️ Modèle de document — à faire relire par un juriste avant publication,
// notamment pour la conformité locale (Côte d'Ivoire / zone UEMOA).

export default function Confidentialite() {
  const sections = [
    {
      titre: "1. Données collectées",
      contenu: (
        <>
          <p>
            Dans le cadre de l&apos;utilisation de MorfyCam, nous pouvons
            collecter :
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
            <li>ton adresse e-mail et les informations liées à ton compte ;</li>
            <li>les images et avatars que tu importes dans l&apos;application ;</li>
            <li>
              l&apos;historique de tes sessions d&apos;utilisation ainsi que
              celui de tes achats afin de gérer ton temps disponible ;
            </li>
            <li>
              les informations nécessaires au traitement de tes paiements,
              transmises directement à nos prestataires de paiement ;
            </li>
            <li>
              le flux vidéo de ta caméra, traité uniquement en temps réel
              pour assurer la transformation visuelle.
            </li>
          </ul>
          <p className="mt-3">
            Le flux vidéo n&apos;est ni enregistré ni conservé par
            MorfyCam.
          </p>
        </>
      ),
    },
    {
      titre: "2. Finalité de la collecte",
      contenu: (
        <>
          <p>Les données collectées sont utilisées uniquement pour :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
            <li>créer et gérer ton compte ;</li>
            <li>fournir les fonctionnalités de MorfyCam ;</li>
            <li>gérer ton temps d&apos;utilisation et tes achats ;</li>
            <li>traiter les paiements de manière sécurisée ;</li>
            <li>répondre à tes demandes d&apos;assistance ;</li>
            <li>améliorer la qualité, la sécurité et les performances du service.</li>
          </ul>
        </>
      ),
    },
    {
      titre: "3. Partage des données",
      contenu: (
        <>
          <p>
            Afin d&apos;assurer le bon fonctionnement de MorfyCam,
            certaines données peuvent être traitées par des prestataires
            techniques agissant pour notre compte. Ces prestataires
            interviennent notamment pour :
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
            <li>l&apos;hébergement sécurisé des données et des fichiers ;</li>
            <li>le traitement des paiements ;</li>
            <li>
              les services d&apos;intelligence artificielle nécessaires aux
              fonctionnalités de transformation en temps réel.
            </li>
          </ul>
          <p className="mt-3">
            Ces prestataires sont tenus de respecter des obligations de
            confidentialité et de sécurité adaptées aux données qu&apos;ils
            traitent. Ils n&apos;utilisent les informations qui leur sont
            confiées que dans la mesure nécessaire à l&apos;exécution de
            leurs services.
          </p>
          <p className="mt-3">
            Nous ne vendons, ne louons et ne partageons jamais tes données
            personnelles à des fins commerciales ou publicitaires.
          </p>
        </>
      ),
    },
    {
      titre: "4. Durée de conservation",
      contenu: (
        <p>
          Tes données sont conservées aussi longtemps que ton compte est
          actif. En cas de suppression de ton compte, elles sont supprimées
          ou anonymisées dans un délai raisonnable, sauf lorsque leur
          conservation est imposée par la loi.
        </p>
      ),
    },
    {
      titre: "5. Tes droits",
      contenu: (
        <>
          <p>Tu peux, à tout moment :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
            <li>accéder à tes données personnelles ;</li>
            <li>demander leur rectification ;</li>
            <li>demander leur suppression lorsque cela est possible.</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contacte notre équipe via la page{" "}
            <a href="/support" className="text-white underline underline-offset-2 hover:opacity-80">
              Support
            </a>
            .
          </p>
        </>
      ),
    },
    {
      titre: "6. Sécurité",
      contenu: (
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          destinées à protéger tes données contre tout accès non autorisé,
          toute perte ou toute utilisation abusive. Les échanges entre ton
          appareil et nos serveurs sont sécurisés, et chaque utilisateur ne
          peut accéder qu&apos;à ses propres données.
        </p>
      ),
    },
    {
      titre: "7. Cookies",
      contenu: (
        <p>
          MorfyCam utilise uniquement les cookies et technologies similaires
          nécessaires au bon fonctionnement du service, notamment pour
          maintenir ta session de connexion. Nous n&apos;utilisons pas de
          cookies destinés à la publicité ou au suivi publicitaire.
        </p>
      ),
    },
    {
      titre: "8. Modification de cette politique",
      contenu: (
        <p>
          Cette politique de confidentialité peut être mise à jour afin de
          tenir compte de l&apos;évolution du service ou de la
          réglementation. En cas de modification importante, nous t&apos;en
          informerons directement dans l&apos;application ou par e-mail.
        </p>
      ),
    },
    {
      titre: "9. Contact",
      contenu: (
        <p>
          Pour toute question concernant cette politique de confidentialité
          ou le traitement de tes données personnelles, tu peux contacter
          notre équipe via la page{" "}
          <a href="/support" className="text-white underline underline-offset-2 hover:opacity-80">
            Support
          </a>{" "}
          de l&apos;application.
        </p>
      ),
    },
  ];

  return (
    // ⚠️ Si app/layout.js contient déjà une <nav> globale avec <Logo />,
    // supprimez la <nav> ci-dessous pour éviter le logo en double.
    <main className="min-h-screen text-white" style={{ backgroundColor: "#808080" }}>
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-0">
        <a href="/" className="text-sm text-white/80 transition hover:text-white">
          ← Retour à l&apos;accueil
        </a>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/70">Document légal</p>
        <h1 className="mt-2 font-display text-4xl font-bold italic text-white md:text-5xl">
          Politique de confidentialité
        </h1>
        <p className="mt-3 text-sm text-white/80">
          Dernière mise à jour : à compléter lors de la publication.
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <div key={s.titre}>
              <h2 className="font-display text-2xl italic text-white">{s.titre}</h2>
              <div className="mt-3 leading-relaxed text-white/90">{s.contenu}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}