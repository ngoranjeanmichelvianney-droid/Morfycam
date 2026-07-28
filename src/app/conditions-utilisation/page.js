// ⚠️ Modèle de document — à faire relire par un juriste avant publication,
// notamment pour la conformité locale (Côte d'Ivoire / zone UEMOA) sur les
// paiements Mobile Money et le traitement d'image par IA.

export default function ConditionsUtilisation() {
  const sections = [
    {
      titre: "1. Objet",
      contenu: (
        <>
          <p>
            Les présentes Conditions générales d&apos;utilisation (CGU)
            définissent les règles d&apos;accès et d&apos;utilisation de
            MorfyCam, une application qui permet de transformer son
            apparence en temps réel grâce à l&apos;intelligence
            artificielle. Le service est destiné au streaming, aux appels
            vidéo, à la création de contenu et au divertissement.
          </p>
          <p className="mt-3">
            En créant un compte ou en utilisant MorfyCam, tu reconnais avoir
            pris connaissance des présentes CGU et acceptes de les
            respecter.
          </p>
        </>
      ),
    },
    {
      titre: "2. Description du service",
      contenu: (
        <p>
          MorfyCam transforme ton apparence en temps réel à partir de ta
          webcam à l&apos;aide d&apos;un avatar que tu choisis ou importes.
          Seule ton apparence visuelle est modifiée : ta voix, tes
          mouvements et tes expressions restent les tiens.
          <br />
          <br />
          Le service fonctionne avec un système de temps
          d&apos;utilisation. Le temps disponible est comptabilisé en
          secondes et n&apos;est déduit que lorsque la transformation est
          effectivement active.
        </p>
      ),
    },
    {
      titre: "3. Compte utilisateur",
      contenu: (
        <>
          <p>
            Pour utiliser MorfyCam, tu dois créer un compte avec des
            informations exactes et à jour. Tu es responsable de la
            confidentialité de tes identifiants ainsi que de toute activité
            effectuée depuis ton compte.
          </p>
          <p className="mt-3">
            Ton compte est personnel et ne peut être partagé.
          </p>
          <p className="mt-3">
            Tu dois être âgé d&apos;au moins 18 ans, ou avoir atteint
            l&apos;âge légal de majorité numérique dans ton pays, pour
            utiliser MorfyCam.
          </p>
        </>
      ),
    },
    {
      titre: "4. Tarifs et paiements",
      contenu: (
        <>
          <p>
            L&apos;accès au service se fait par l&apos;achat de packs de
            temps. Les moyens de paiement disponibles sont indiqués au
            moment de l&apos;achat.
          </p>
          <p className="mt-3">
            Chaque pack possède une durée de validité précisée avant le
            paiement. Une fois cette durée expirée, le temps restant non
            utilisé est perdu.
          </p>
          <p className="mt-3">
            Les paiements sont traités de manière sécurisée par nos
            prestataires spécialisés. MorfyCam ne stocke jamais les
            informations relatives à ta carte bancaire ou à ton moyen de
            paiement.
          </p>
          <p className="mt-3">
            Sauf disposition légale contraire ou erreur de notre part, les
            achats de packs de temps ne sont pas remboursables après
            validation du paiement.
          </p>
        </>
      ),
    },
    {
      titre: "5. Utilisation autorisée",
      contenu: (
        <p>
          Tu peux utiliser MorfyCam pour modifier ta propre apparence dans
          le cadre du streaming, des appels vidéo, de la création de
          contenu ou de tout autre usage personnel ou professionnel
          conforme à la loi et aux présentes conditions.
        </p>
      ),
    },
    {
      titre: "6. Utilisations interdites",
      contenu: (
        <>
          <p>L&apos;utilisation de MorfyCam est notamment interdite pour :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
            <li>usurper l&apos;identité d&apos;une personne sans son autorisation ;</li>
            <li>tromper volontairement une personne sur ton identité ;</li>
            <li>créer ou diffuser des contenus impliquant des mineurs ;</li>
            <li>
              commettre ou faciliter une fraude, une escroquerie, du
              harcèlement, de l&apos;intimidation ou de la diffamation ;
            </li>
            <li>
              diffuser des contenus illégaux, haineux, violents ou non
              consentis ;
            </li>
            <li>
              tenter de contourner les mesures de sécurité ou d&apos;accéder
              sans autorisation aux systèmes de MorfyCam.
            </li>
          </ul>
          <p className="mt-3">
            Toute violation des présentes conditions peut entraîner la
            suspension ou la suppression du compte, sans remboursement des
            crédits restants. Lorsque la loi l&apos;exige, les faits
            pourront être signalés aux autorités compétentes.
          </p>
        </>
      ),
    },
    {
      titre: "7. Propriété intellectuelle",
      contenu: (
        <>
          <p>
            Les images, avatars et autres contenus que tu importes restent
            ta propriété.
          </p>
          <p className="mt-3">
            En utilisant MorfyCam, tu nous accordes uniquement les
            autorisations nécessaires au fonctionnement du service,
            notamment pour le traitement, le stockage temporaire et
            l&apos;affichage de ces contenus dans ton espace personnel.
            Aucun droit de propriété ne nous est transféré.
          </p>
        </>
      ),
    },
    {
      titre: "8. Disponibilité du service",
      contenu: (
        <>
          <p>
            Nous mettons tout en œuvre pour assurer un service fiable et
            disponible. Toutefois, des interruptions temporaires peuvent
            survenir, notamment lors des opérations de maintenance ou en
            cas d&apos;événements indépendants de notre volonté.
          </p>
          <p className="mt-3">
            Dans les limites prévues par la loi, MorfyCam ne pourra être
            tenu responsable des dommages indirects résultant de
            l&apos;utilisation ou de l&apos;indisponibilité du service.
          </p>
        </>
      ),
    },
    {
      titre: "9. Résiliation",
      contenu: (
        <>
          <p>
            Tu peux supprimer ton compte à tout moment depuis les
            paramètres de l&apos;application ou en contactant le support.
          </p>
          <p className="mt-3">
            Nous pouvons suspendre ou supprimer un compte en cas de
            non-respect des présentes Conditions générales
            d&apos;utilisation.
          </p>
        </>
      ),
    },
    {
      titre: "10. Modification des CGU",
      contenu: (
        <>
          <p>
            Les présentes CGU peuvent être modifiées afin de tenir compte
            de l&apos;évolution du service ou de la réglementation
            applicable.
          </p>
          <p className="mt-3">
            En cas de changement important, nous t&apos;en informerons
            directement dans l&apos;application ou par e-mail. La poursuite
            de l&apos;utilisation du service après leur mise à jour vaut
            acceptation des nouvelles conditions.
          </p>
        </>
      ),
    },
    {
      titre: "11. Contact",
      contenu: (
        <p>
          Pour toute question concernant les présentes Conditions générales
          d&apos;utilisation, tu peux contacter notre équipe via la page{" "}
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
          Conditions d&apos;utilisation
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