"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { models } from "@decartai/sdk";
import { supabase } from "@/lib/supabase-browser";
import { connecterDecart } from "@/lib/useDecartSwap";
import Affiliation from "@/components/Affiliation";

// Même modelId que dans useDecartSwap.js — garde les deux synchronisés.
const MODELE = models.realtime("lucy-2.5");

const OFFRES = [
  {
    id: "10k",
    titre: "Pack Découverte",
    duree: "6 min 20 s",
    prix: 10000,
    uniteFCFA: "10 000 F",
    badge: "Idéal pour débuter",
    couleur: "mirage",
    dureeValiditeJours: 5,
    filigrane: true,
    fonctionnalites: [
      "Logo Mirage visible sur le rendu",
      "Filigrane sur toutes les vidéos",
      "Transformation du visage uniquement",
      "Qualité SD",
    ],
  },
  {
    id: "20k",
    titre: "Pack Pass Dja",
    duree: "12 min 40 s",
    prix: 20000,
    uniteFCFA: "20 000 F",
    badge: "Le plus populaire 🔥",
    populaire: true,
    couleur: "ember",
    dureeValiditeJours: 14,
    filigrane: false,
    fonctionnalites: [
      "Sans filigrane, sans logo",
      "Transformation du visage et du corps entier",
      "Qualité HD",
    ],
  },
  {
    id: "40k",
    titre: "Pack Studio Live",
    duree: "25 min 20 s",
    prix: 40000,
    uniteFCFA: "40 000 F",
    badge: "Usage Intensif",
    couleur: "ember",
    dureeValiditeJours: 70,
    filigrane: false,
    fonctionnalites: [
      "Sans filigrane, sans logo",
      "Transformation du visage et du corps entier",
      "Qualité HD",
      "Sessions multiples dans la journée",
    ],
  },
  {
    id: "60k",
    titre: "Pack VIP",
    duree: "38 min",
    prix: 60000,
    uniteFCFA: "60 000 F",
    badge: "Offre Événement",
    meilleureOffre: true,
    couleur: "ember",
    dureeValiditeJours: 130,
    filigrane: false,
    fonctionnalites: [
      "Sans filigrane, sans logo",
      "Transformation du visage et du corps entier",
      "Qualité Full HD",
      "Support prioritaire",
    ],
  },
  {
    id: "100k",
    titre: "Pack Prestige",
    duree: "63 min 20 s",
    prix: 100000,
    uniteFCFA: "100 000 F",
    badge: "Offre Ultime",
    couleur: "ember",
    dureeValiditeJours: 365,
    filigrane: false,
    fonctionnalites: [
      "Sans filigrane, sans logo",
      "Transformation du visage et du corps entier",
      "Qualité Full HD",
      "Support prioritaire",
      "Accès anticipé aux nouveaux avatars",
    ],
  },
];

// Seuls Wave et Orange Money sont branchés sur l'auto-crédit par SMS
// (voir GUIDE_MACRODROID.md). Les autres restent affichés mais désactivés
// tant qu'ils ne sont pas connectés au même système — ou à CinetPay plus tard.
const MOYENS_PAIEMENT = [
  {
    id: "orange",
    nom: "Orange Money",
    logo: "/logos/L1.jpeg",
    idMoyenAuto: "orange_money",
    automatise: true,
  },
  {
    id: "wave",
    nom: "Wave",
    logo: "/logos/L2.jpeg",
    idMoyenAuto: "wave",
    automatise: true,
  },
  { id: "mtn", nom: "MTN Mobile Money", logo: "/logos/L3.jpeg", automatise: false },
  { id: "moov", nom: "Moov Money", logo: "/logos/L4.jpeg", automatise: false },
  { id: "djamo", nom: "Djamo", logo: "/logos/L5.jpeg", automatise: false },
];

// Liens de paiement fixes générés une fois dans l'appli Wave Business et
// OM Business (un lien par montant de pack) — TODO: colle tes vrais liens ici.
const LIENS_PAIEMENT = {
  "10k": { wave: "https://wave.com/pay/REMPLACER_10K", orange_money: "https://om.ci/pay/REMPLACER_10K" },
  "20k": { wave: "https://wave.com/pay/REMPLACER_20K", orange_money: "https://om.ci/pay/REMPLACER_20K" },
  "40k": { wave: "https://wave.com/pay/REMPLACER_40K", orange_money: "https://om.ci/pay/REMPLACER_40K" },
  "60k": { wave: "https://wave.com/pay/REMPLACER_60K", orange_money: "https://om.ci/pay/REMPLACER_60K" },
  "100k": { wave: "https://wave.com/pay/REMPLACER_100K", orange_money: "https://om.ci/pay/REMPLACER_100K" },
};

// Combien de temps on attend le SMS avant de dire à l'utilisateur que
// quelque chose ne va pas (doit rester cohérent avec la fenêtre de 30 min
// côté fonction SQL expirer_demandes_recharge).
const DELAI_EXPIRATION_MS = 30 * 60 * 1000;

// Styles proposés pour la retouche IA de l'avatar (envoyés comme "prompt"
// à fal-ai/image-editing/style-transfer — à confirmer dans le Playground
// fal.ai avant la prod, le nom exact du champ n'est pas garanti).
const STYLES_DISPONIBLES = [
  { id: null, label: "Aucun effet" },
  { id: "cartoon vibrant, contours nets, couleurs saturées", label: "Cartoon" },
  { id: "aquarelle douce, textures peintes à la main", label: "Aquarelle" },
  { id: "anime japonais, grands yeux, lignes fines", label: "Anime" },
];

// Décompose un nombre de secondes en { h, m, s } (chaînes à 2 chiffres)
function decomposerTemps(totalSecondes) {
  const total = Math.max(0, Math.floor(totalSecondes));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

// Formatte une date en français : "26 juil. 2026 à 14:32"
function formatDateHeure(date) {
  const datePart = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const heurePart = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} à ${heurePart}`;  
}

// Convertit une data URL (base64, issue de FileReader) en Blob
// uploadable vers Supabase Storage.
function dataURLVersBlob(dataURL) {
  const [entete, base64] = dataURL.split(",");
  const correspondanceMime = entete.match(/:(.*?);/);
  const mime = correspondanceMime ? correspondanceMime[1] : "image/jpeg";
  const binaire = atob(base64);
  const tableauOctets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) {
    tableauOctets[i] = binaire.charCodeAt(i);
  }
  return new Blob([tableauOctets], { type: mime });
}

export default function Dashboard() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [monte, setMonte] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const [resultat, setResultat] = useState(null);
  const [enTraitement, setEnTraitement] = useState(false);
  const [survolAvatar, setSurvolAvatar] = useState(false);
  const [enDirect, setEnDirect] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [peripheriques, setPeripheriques] = useState([]);
  const [erreurCamera, setErreurCamera] = useState(null);
  const [connexionEnCours, setConnexionEnCours] = useState(false);
  const [fluxBrut, setFluxBrut] = useState(null); // flux caméra original, pour l'affichage
  const [indexPhrase, setIndexPhrase] = useState(0);

  // Retouche IA de l'avatar (fal.ai) : suppression de fond et style sont
  // au choix de l'utilisateur — l'amélioration de qualité, elle, est
  // toujours appliquée automatiquement côté serveur, sans option.
  const [enleverFond, setEnleverFond] = useState(false);
  const [styleChoisi, setStyleChoisi] = useState(null);
  const [traitementAvatarEnCours, setTraitementAvatarEnCours] = useState(false);

  // Crédit de temps restant (en secondes), chargé depuis profils.solde_secondes
  // (lui-même recalculé côté base à partir des lots de temps non expirés).
  // 0 par défaut tant que la vraie valeur n'est pas encore arrivée de Supabase,
  // pour ne pas laisser croire à l'utilisateur qu'il a du temps gratuit.
  const [secondesRestantes, setSecondesRestantes] = useState(0);
  const [soldeCharge, setSoldeCharge] = useState(false);

  // Historique des sessions de swap déjà utilisées (date + durée),
  // chargé depuis la table sessions_utilisation.
  const [historiqueUtilisation, setHistoriqueUtilisation] = useState([]);

  // Avatars enregistrés : métadonnées depuis avatars_utilisateur,
  // fichiers réels sur Supabase Storage (bucket privé "avatars").
  const [avatarsEnregistres, setAvatarsEnregistres] = useState([]);
  const [enregistrementAvatarEnCours, setEnregistrementAvatarEnCours] = useState(false);

  // Recharge / paiement
  const [modalRechargeOuvert, setModalRechargeOuvert] = useState(false);
  const [offreSelectionnee, setOffreSelectionnee] = useState(null);
  // "offres" : liste des packs à choisir — "paiement" : moyens de paiement pour le pack déjà choisi
  const [etapeModal, setEtapeModal] = useState("offres");
  const [envoiDemandeEnCours, setEnvoiDemandeEnCours] = useState(false);

  const phrasesMarketing = [
    "Deviens qui tu veux, en direct, sans montage.",
    "Une photo suffit. Le reste, c'est de la magie en temps réel.",
    "Créateurs, streamers, curieux : à vous de jouer.",
    "Zéro téléchargement. Juste ta caméra et ton imagination.",
  ];

  const avatarInputRef = useRef(null);
  const videoRef = useRef(null);
  const videoSortieRef = useRef(null);
  const streamRef = useRef(null);
  const decartClientRef = useRef(null);
  const debutSessionRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUtilisateur(data.user));
    setMonte(true);
  }, []);

  // Charge le solde réel et l'historique des sessions dès qu'on connaît
  // l'utilisateur — remplace les anciennes valeurs codées en dur.
  useEffect(() => {
    if (!utilisateur?.id) return;

    let annule = false;

    async function chargerDonneesDashboard() {
      const [{ data: profil, error: erreurProfil }, { data: sessions, error: erreurSessions }] =
        await Promise.all([
          supabase
            .from("profils")
            .select("solde_secondes")
            .eq("id", utilisateur.id)
            .single(),
          supabase
            .from("sessions_utilisation")
            .select("id, debut, fin, duree_secondes")
            .eq("utilisateur_id", utilisateur.id)
            .order("debut", { ascending: false })
            .limit(20),
        ]);

      if (annule) return;

      if (erreurProfil) {
        console.error("Erreur chargement du solde :", erreurProfil);
      } else {
        setSecondesRestantes(profil?.solde_secondes ?? 0);
      }
      setSoldeCharge(true);

      if (erreurSessions) {
        console.error("Erreur chargement de l'historique :", erreurSessions);
      } else {
        setHistoriqueUtilisation(
          (sessions ?? []).map((s) => ({
            id: s.id,
            debut: new Date(s.debut),
            fin: new Date(s.fin),
            dureeSecondes: s.duree_secondes,
          }))
        );
      }
    }

    chargerDonneesDashboard();

    return () => {
      annule = true;
    };
  }, [utilisateur?.id]);

  // Charge la liste des avatars enregistrés (métadonnées + URL signée
  // temporaire, puisque le bucket "avatars" est privé).
  const chargerAvatars = useCallback(async () => {
    if (!utilisateur?.id) return;

    const { data: lignes, error } = await supabase
      .from("avatars_utilisateur")
      .select("id, chemin_storage")
      .eq("utilisateur_id", utilisateur.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement avatars :", error);
      return;
    }

    const avatarsAvecUrl = await Promise.all(
      (lignes ?? []).map(async (ligne) => {
        const { data, error: erreurUrl } = await supabase.storage
          .from("avatars")
          .createSignedUrl(ligne.chemin_storage, 3600);
        if (erreurUrl) {
          console.error("Erreur génération URL avatar :", erreurUrl);
          return null;
        }
        return { id: ligne.id, cheminStorage: ligne.chemin_storage, url: data?.signedUrl };
      })
    );

    setAvatarsEnregistres(avatarsAvecUrl.filter(Boolean));
  }, [utilisateur?.id]);

  useEffect(() => {
    chargerAvatars();
  }, [chargerAvatars]);

  // Liste des caméras disponibles pour le sélecteur
  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => setPeripheriques(devices.filter((d) => d.kind === "videoinput")))
      .catch(() => {});
  }, []);

  // Fait défiler les phrases d'accroche automatiquement
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndexPhrase((i) => (i + 1) % phrasesMarketing.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  // Décompte le temps restant uniquement quand le swap est actif en Direct.
  // Ce décompte reste local pour une UI fluide seconde par seconde — la
  // valeur réelle en base n'est mise à jour qu'à l'arrêt de la caméra
  // (voir arreterCamera), pour éviter d'écrire dans Supabase 1x/seconde.
  useEffect(() => {
    if (!cameraActive || !enDirect) return;
    const intervalId = setInterval(() => {
      setSecondesRestantes((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [cameraActive, enDirect]);

  // Coupe automatiquement le swap dès que le temps est épuisé pendant
  // une session active — sans ça, l'appel continue indéfiniment une fois
  // le compteur arrivé à 00:00:00 puisque rien ne l'arrête de lui-même.
  useEffect(() => {
    if (cameraActive && enDirect && secondesRestantes <= 0) {
      arreterCamera();
      setErreurCamera("Ton temps est épuisé — recharge pour continuer.");
    }
  }, [secondesRestantes, cameraActive, enDirect]);

  // Nettoyage à la sortie du composant
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      decartClientRef.current?.disconnect?.();
    };
  }, []);

  // Attache le flux caméra brut via une ref-callback : contrairement à un
  // useEffect classique, elle se redéclenche à CHAQUE montage du <video>,
  // même si l'élément est démonté puis remonté (ex: bascule vers/depuis
  // le spinner "Connexion en cours…").
  const attacherVideoOriginale = useCallback(
    (element) => {
      videoRef.current = element;
      if (element && fluxBrut) {
        element.srcObject = fluxBrut;
        element.play().catch(() => {});
      }
    },
    [fluxBrut]
  );

  const chargerAvatar = useCallback((fichier) => {
    if (!fichier) return;
    const lecteur = new FileReader();
    lecteur.onload = (e) => {
      setAvatarSource(e.target.result);
      setResultat(null);
      setEnTraitement(true);
      // Placeholder — pas encore de logique IA branchée à ce stade.
      setTimeout(() => {
        setResultat(e.target.result);
        setEnTraitement(false);
      }, 900);
    };
    lecteur.readAsDataURL(fichier);
  }, []);

  // Envoie l'avatar actuel à la route serveur /api/fal/traiter-avatar :
  // amélioration de qualité toujours appliquée, suppression de fond et
  // style seulement si l'utilisateur les a choisis. Remplace ensuite
  // avatarSource par le résultat traité.
  const ameliorerAvatarAvecIA = useCallback(async () => {
    if (!avatarSource) return;

    setTraitementAvatarEnCours(true);
    setErreurCamera(null);

    try {
      const reponse = await fetch("/api/fal/traiter-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: avatarSource,
          enleverFond,
          style: styleChoisi,
        }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(donnees?.erreur || "Échec du traitement.");
      }

      setAvatarSource(donnees.url);
      setResultat(donnees.url);
    } catch (err) {
      console.error("Erreur amélioration avatar :", err);
      setErreurCamera("Le traitement de l'avatar a échoué. Réessaie.");
    } finally {
      setTraitementAvatarEnCours(false);
    }
  }, [avatarSource, enleverFond, styleChoisi]);

  // Upload l'avatar actuellement chargé (avatarSource) vers Supabase
  // Storage, dans le dossier de l'utilisateur, puis enregistre la
  // référence en base pour qu'il réapparaisse dans "Avatars enregistrés".
  const enregistrerAvatarActuel = useCallback(async () => {
    if (!avatarSource || !utilisateur?.id) return;

    setEnregistrementAvatarEnCours(true);

    // avatarSource peut être une data URL (upload local) ou une URL http
    // (résultat renvoyé par fal.ai) — on gère les deux avant l'upload.
    const blob = avatarSource.startsWith("data:")
      ? dataURLVersBlob(avatarSource)
      : await (await fetch(avatarSource)).blob();

    const extension = blob.type.split("/")[1] || "jpg";
    const cheminStorage = `${utilisateur.id}/${Date.now()}.${extension}`;

    const { error: erreurUpload } = await supabase.storage
      .from("avatars")
      .upload(cheminStorage, blob, { contentType: blob.type });

    if (erreurUpload) {
      console.error("Erreur upload avatar :", erreurUpload);
      setEnregistrementAvatarEnCours(false);
      return;
    }

    const { error: erreurInsert } = await supabase.from("avatars_utilisateur").insert({
      utilisateur_id: utilisateur.id,
      chemin_storage: cheminStorage,
    });

    if (erreurInsert) {
      console.error("Erreur enregistrement avatar en base :", erreurInsert);
    }

    setEnregistrementAvatarEnCours(false);
    chargerAvatars();
  }, [avatarSource, utilisateur?.id, chargerAvatars]);

  // Supprime un avatar enregistré : à la fois le fichier sur Storage
  // et sa référence en base.
  const supprimerAvatar = useCallback(
    async (avatar) => {
      const { error: erreurSuppressionFichier } = await supabase.storage
        .from("avatars")
        .remove([avatar.cheminStorage]);
      if (erreurSuppressionFichier) {
        console.error("Erreur suppression fichier avatar :", erreurSuppressionFichier);
      }

      const { error: erreurSuppressionLigne } = await supabase
        .from("avatars_utilisateur")
        .delete()
        .eq("id", avatar.id);
      if (erreurSuppressionLigne) {
        console.error("Erreur suppression ligne avatar :", erreurSuppressionLigne);
      }

      chargerAvatars();
    },
    [chargerAvatars]
  );

  const demarrerCamera = useCallback(
    async (deviceId) => {
      setErreurCamera(null);
      try {
        // Contraintes alignées sur le modèle Decart (fps/width/height) :
        // un décalage ici peut faire croire que le flux transformé ne
        // suit pas les mouvements de la personne.
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
            frameRate: MODELE.fps,
            width: MODELE.width,
            height: MODELE.height,
          },
          audio: false,
        });
        streamRef.current = stream;
        debutSessionRef.current = Date.now();
        setFluxBrut(stream); // déclenche l'attachement via le useEffect ci-dessus
        setCameraActive(true);

        // Si un avatar est chargé et qu'on est en mode Direct, on branche Decart
        if (enDirect && avatarSource) {
          setConnexionEnCours(true);
          try {
            const client = await connecterDecart(
              stream,
              avatarSource,
              (fluxEdite) => {
                if (videoSortieRef.current) {
                  videoSortieRef.current.srcObject = fluxEdite;
                  videoSortieRef.current
                    .play()
                    .catch((e) => console.warn("Lecture bloquée :", e));
                }
              },
              { modelId: "lucy-2.5" }
            );
            decartClientRef.current = client;
          } catch (err) {
            console.error("Erreur connexion Decart :", err);
            setErreurCamera("Impossible de connecter le flux temps réel.");
          } finally {
            setConnexionEnCours(false);
          }
        }
      } catch (err) {
        console.error("Erreur accès caméra (détail complet) :", err.name, err.message, err);
        if (err.name === "NotAllowedError") {
          setErreurCamera("Permission caméra refusée. Autorise l'accès dans les paramètres du navigateur.");
        } else if (err.name === "NotFoundError") {
          setErreurCamera("Aucune caméra détectée.");
        } else {
          setErreurCamera("Erreur d'accès à la caméra.");
        }
      }
    },
    [enDirect, avatarSource]
  );

  const arreterCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    decartClientRef.current?.disconnect?.();
    decartClientRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (videoSortieRef.current) videoSortieRef.current.srcObject = null;
    setFluxBrut(null);
    setCameraActive(false);

    // Enregistre la session dans l'historique local (date + durée utilisée)
    // ET persiste en base : insère la session dans sessions_utilisation.
    // C'est cet insert qui déclenche le trigger SQL
    // apres_session_debiter_solde, lequel décrémente les lots de temps
    // (en security definer, donc pas soumis à RLS). On ne fait jamais
    // d'update direct sur profils depuis le navigateur : il n'y a
    // volontairement pas de policy RLS "update" sur cette table.
    if (debutSessionRef.current && utilisateur?.id) {
      const debut = new Date(debutSessionRef.current);
      const fin = new Date();
      const dureeSecondes = Math.round((fin - debut) / 1000);

      if (dureeSecondes > 0) {
        setHistoriqueUtilisation((historique) => [
          { id: `local-${debutSessionRef.current}`, debut, fin, dureeSecondes },
          ...historique,
        ]);

        supabase
          .from("sessions_utilisation")
          .insert({
            utilisateur_id: utilisateur.id,
            debut: debut.toISOString(),
            fin: fin.toISOString(),
            duree_secondes: dureeSecondes,
          })
          .then(({ error }) => {
            if (error) console.error("Erreur enregistrement session :", error);
          });
      }
      debutSessionRef.current = null;
    }
  }, [utilisateur?.id]);

  const toggleCamera = () => (cameraActive ? arreterCamera() : demarrerCamera());

  function ouvrirModalRecharge() {
    setOffreSelectionnee(null);
    setEtapeModal("offres");
    setModalRechargeOuvert(true);
  }

  // Utilisée par le bouton "Choisir cette offre" sur les cartes de tarifs :
  // saute directement à l'étape paiement, pas besoin de re-choisir le pack.
  function ouvrirModalAvecOffre(idOffre) {
    setOffreSelectionnee(idOffre);
    setEtapeModal("paiement");
    setModalRechargeOuvert(true);
  }

  function fermerModalRecharge() {
    setModalRechargeOuvert(false);
  }

  function choisirOffreDansModal(idOffre) {
    setOffreSelectionnee(idOffre);
    setEtapeModal("paiement");
  }

  // Clic sur un moyen de paiement : crée d'abord la demande de recharge
  // "en_attente" en base (c'est elle que le script SMS ou le webhook
  // CinetPay ira valider par la suite), puis ouvre la page de paiement
  // Wave/OM pour le montant exact du pack choisi, dans un nouvel onglet.
  async function payerAvec(moyen) {
    if (!moyen.automatise || !utilisateur?.id || !offreSelectionnee) return;

    const lien = LIENS_PAIEMENT[offreSelectionnee]?.[moyen.idMoyenAuto];
    if (!lien) return;

    const offre = OFFRES.find((o) => o.id === offreSelectionnee);
    if (!offre) return;

    setEnvoiDemandeEnCours(true);
    const { error } = await supabase.from("demandes_recharge").insert({
      utilisateur_id: utilisateur.id,
      pack_id: offre.id,
      montant_fcfa: offre.prix,
      moyen_paiement: moyen.idMoyenAuto,
      statut: "en_attente",
    });
    setEnvoiDemandeEnCours(false);

    if (error) {
      console.error("Erreur création de la demande de recharge :", error);
      // On laisse quand même l'utilisateur payer — le script d'auto-crédit
      // par SMS pourra créer la demande de son côté si besoin. À terme,
      // mieux vaut bloquer ici et afficher une erreur claire à l'utilisateur.
    }

    window.open(lien, "_blank", "noopener,noreferrer");
  }

  const offreChoisie = OFFRES.find((o) => o.id === offreSelectionnee);

  const prenom = utilisateur?.user_metadata?.nom_affichage?.split(" ")[0];

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes bg-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .dashboard-bg {
          background: #18181b;
        }

        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-50px, 50px) scale(1.1); }
        }
        .dashboard-orb-1 {
          position: fixed; top: -150px; left: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,68,129,0.35) 0%, transparent 70%);
          animation: orb-float-1 9s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .dashboard-orb-2 {
          position: fixed; bottom: -200px; right: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,30,80,0.4) 0%, transparent 70%);
          animation: orb-float-2 13s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }

        @keyframes carte-apparition {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .carte-animee {
          animation: carte-apparition 0.6s ease-out both;
        }
      `}</style>

      <main className="dashboard-bg relative min-h-screen overflow-x-hidden text-sand">
        {/* Orbes animés en fond */}
        <div className="dashboard-orb-1" />
        <div className="dashboard-orb-2" />

        {/* Bandeau d'alerte recharge — visible seulement si le temps est épuisé
            (uniquement une fois le vrai solde chargé, pour ne pas clignoter
            "épuisé" pendant l'instant où secondesRestantes vaut encore 0) */}
        {soldeCharge && secondesRestantes <= 0 && (
          <div className="carte-animee flex items-center justify-center gap-3 bg-gradient-to-r from-ember to-mirage px-4 py-2 text-center text-sm font-medium text-ink">
            <span>Ton temps est épuisé — recharge pour continuer le swap</span>
            <button
              onClick={ouvrirModalRecharge}
              className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-sand transition-opacity hover:opacity-80"
            >
              Recharger
            </button>
          </div>
        )}

        {/* Barre supérieure */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b border-sand-dim/15 bg-umber/70 backdrop-blur-md px-6 py-4 transition-opacity duration-500 ${
            monte ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <h1 className="font-display text-2xl italic">
              <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-ember to-mirage animate-[text-shimmer_5s_linear_infinite]">
                Swap en temps réel
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-jaune">
              {prenom ? `Session de ${prenom}` : "Nouvelle session"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={ouvrirModalRecharge}
              className="rounded-full bg-ember px-4 py-1.5 text-xs font-medium text-ink transition-all duration-200 hover:opacity-90"
            >
              Recharger
            </button>

            <div className="flex overflow-hidden rounded-full border border-sand-dim/20 text-xs font-medium">
              <button
                onClick={() => setEnDirect(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors duration-200 ${
                  enDirect ? "bg-mirage text-ink" : "text-sand-dim hover:text-sand"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${enDirect ? "bg-ink" : "bg-sand-dim"}`} />
                Direct
              </button>
              <button
                onClick={() => setEnDirect(false)}
                className={`px-3 py-1.5 transition-colors duration-200 ${
                  !enDirect ? "bg-sand-dim/20 text-sand" : "text-sand-dim hover:text-sand"
                }`}
              >
                Hors ligne
              </button>
            </div>
          </div>
        </div>

        {/* Section Temps restant — grande et colorée */}
        <section className="carte-animee relative border-b border-sand-dim/15 bg-[#18181b] px-6 py-8 text-center">
          <div className="relative mx-auto max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
              Temps restant
            </p>

            {(() => {
              const { h, m, s } = decomposerTemps(secondesRestantes);
              const critique = secondesRestantes <= 60;
              return (
                <div className="mt-4 flex items-end justify-center gap-3 sm:gap-5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-4xl font-bold leading-none sm:text-5xl ${
                        critique ? "text-ember" : "text-violet"
                      }`}
                    >
                      {h}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-sand-dim">
                      Heures
                    </span>
                  </div>

                  <span className="pb-4 font-mono text-3xl text-sand-dim/40 sm:text-4xl">:</span>

                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-6xl font-extrabold leading-none sm:text-8xl ${
                        critique ? "text-ember" : "text-[#e8dcc4]"
                      }`}
                    >
                      {m}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase tracking-widest text-sand-dim">
                      Minutes
                    </span>
                  </div>

                  <span className="pb-4 font-mono text-3xl text-sand-dim/40 sm:text-4xl">:</span>

                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-4xl font-bold leading-none sm:text-5xl ${
                        critique ? "text-ember" : "text-jaune"
                      }`}
                    >
                      {s}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-sand-dim">
                      Secondes
                    </span>
                  </div>
                </div>
              );
            })()}

            <p className="mt-4 text-xs text-sand-dim">
              {cameraActive && enDirect
                ? "Le compteur défile — swap en cours."
                : "Le compteur est en pause tant que le swap n'est pas actif."}
            </p>

            {secondesRestantes <= 60 && (
              <button
                onClick={ouvrirModalRecharge}
                className="mt-4 rounded-full bg-ember px-6 py-2 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_24px_-6px_theme(colors.ember)]"
              >
                Recharger maintenant
              </button>
            )}
          </div>
        </section>

        {/* Section Historique d'utilisation — temps déjà utilisé + dates */}
        <section className="border-b border-sand-dim/15 bg-umber/60 backdrop-blur-md px-6 py-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mirage">
                Historique d&apos;utilisation
              </p>
              {historiqueUtilisation.length > 0 && (
                <span className="text-xs text-sand-dim">
                  {historiqueUtilisation.length} session
                  {historiqueUtilisation.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {historiqueUtilisation.length === 0 ? (
              <p className="mt-3 text-xs text-sand-dim/60">
                Tes sessions de swap apparaîtront ici avec la date et la durée
                utilisée, dès que tu auras démarré puis arrêté la caméra.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {historiqueUtilisation.map((session, i) => {
                  const couleurs = ["mirage", "ember", "jaune", "violet"];
                  const couleur = couleurs[i % couleurs.length];
                  const { h, m, s } = decomposerTemps(session.dureeSecondes);
                  return (
                    <div
                      key={session.id}
                      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border-l-4 bg-ink px-4 py-3 border-${couleur}`}
                    >
                      <div>
                        <p className="text-sm text-sand">
                          {formatDateHeure(session.debut)}
                        </p>
                        <p className="text-xs text-sand-dim">
                          Session terminée à{" "}
                          {session.fin.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className={`font-mono text-lg font-semibold text-${couleur}`}>
                        {h !== "00" ? `${h}h ` : ""}
                        {m}min {s}s
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Corps : 2 colonnes */}
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr]">
          {/* Colonne gauche — Source + Original */}
          <section
            className={`rounded-xl border border-sand-dim/15 bg-umber/60 backdrop-blur-md p-4 transition-all duration-500 delay-75 carte-animee ${
              monte ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-mirage">
              Source de l&apos;avatar
            </h2>

            <div
              onClick={() => avatarInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                setSurvolAvatar(false);
                chargerAvatar(e.dataTransfer.files?.[0]);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setSurvolAvatar(true);
              }}
              onDragLeave={() => setSurvolAvatar(false)}
              className={`mt-3 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-ink text-center transition-all duration-300 ${
                survolAvatar
                  ? "scale-[1.02] border-mirage shadow-[0_0_24px_-8px_theme(colors.mirage)]"
                  : "border-sand-dim/20 hover:border-mirage/50"
              }`}
            >
              {avatarSource ? (
                <img src={avatarSource} alt="Avatar" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <p className="px-4 text-xs text-sand-dim">
                  {survolAvatar ? "Dépose l'image" : "Dépose un avatar"}
                </p>
              )}
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => chargerAvatar(e.target.files?.[0])}
              className="hidden"
            />

            <button
              onClick={() => avatarInputRef.current?.click()}
              className="mt-3 w-full rounded-full bg-mirage px-4 py-2 text-sm font-medium text-ink transition-all duration-200 hover:opacity-90"
            >
              Charger une image
            </button>

            {/* Retouche IA de l'avatar — l'amélioration de qualité est
                toujours appliquée automatiquement côté serveur ; seuls
                la suppression de fond et le style sont au choix ici. */}
            {avatarSource && (
              <div className="mt-4 space-y-2 rounded-lg border border-sand-dim/15 bg-ink p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-jaune">
                  Retouche IA (optionnelle)
                </p>

                <label className="flex items-center gap-2 text-xs text-sand-dim">
                  <input
                    type="checkbox"
                    checked={enleverFond}
                    onChange={(e) => setEnleverFond(e.target.checked)}
                  />
                  Enlever le fond
                </label>

                <select
                  value={styleChoisi ?? ""}
                  onChange={(e) => setStyleChoisi(e.target.value || null)}
                  className="w-full rounded-lg border border-sand-dim/20 bg-umber px-2 py-1.5 text-xs text-sand-dim outline-none"
                >
                  {STYLES_DISPONIBLES.map((s) => (
                    <option key={s.label} value={s.id ?? ""}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={ameliorerAvatarAvecIA}
                  disabled={traitementAvatarEnCours}
                  className="w-full rounded-full bg-jaune px-3 py-1.5 text-xs font-medium text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {traitementAvatarEnCours ? "Traitement en cours…" : "Améliorer avec IA"}
                </button>
              </div>
            )}

            {cameraActive && (
              <div className="mt-6 animate-[fade-up_0.3s_ease-out]">
                <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
                  Vidéo originale
                </p>
                <div className="mt-2 aspect-video overflow-hidden rounded-lg bg-ink">
                  <video
                    ref={attacherVideoOriginale}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-jaune">
                  Avatars enregistrés
                </p>
                <button
                  onClick={enregistrerAvatarActuel}
                  disabled={!avatarSource || enregistrementAvatarEnCours}
                  className="text-xs text-mirage transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {enregistrementAvatarEnCours ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {avatarsEnregistres.length === 0 ? (
                  <p className="text-xs text-sand-dim/60">
                    Tes avatars sauvegardés apparaîtront ici.
                  </p>
                ) : (
                  avatarsEnregistres.map((avatar) => (
                    <div key={avatar.id} className="group relative h-12 w-12">
                      <button
                        onClick={() => setAvatarSource(avatar.url)}
                        className="h-12 w-12 overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-mirage"
                      >
                        <img src={avatar.url} alt="" className="h-full w-full object-cover" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          supprimerAvatar(avatar);
                        }}
                        aria-label="Supprimer cet avatar"
                        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] text-ink group-hover:flex"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Colonne centrale — Caméra / Transformation */}
          <section
            className={`flex min-h-[70vh] flex-col rounded-xl border border-sand-dim/15 bg-umber/60 backdrop-blur-md p-4 transition-all duration-500 delay-150 carte-animee ${
              monte ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {cameraActive ? (
              <div className="flex h-full flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-ember">
                    {enDirect ? "Flux transformé" : "Caméra"}
                  </p>
                  {enDirect && decartClientRef.current && (
                    <span className="flex items-center gap-1.5 rounded-full border border-mirage/30 bg-mirage/10 px-2 py-0.5 text-[10px] font-medium text-mirage">
                      <span className="h-1.5 w-1.5 rounded-full bg-mirage" />
                      Visage généré par IA
                    </span>
                  )}
                </div>

                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-ink">
                  {connexionEnCours ? (
                    <div className="flex flex-col items-center gap-3">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-mirage/25 border-t-mirage" />
                      <p className="text-xs text-sand-dim">Connexion du flux temps réel…</p>
                    </div>
                  ) : enDirect && avatarSource ? (
                    <video
                      ref={videoSortieRef}
                      autoPlay
                      playsInline
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="px-4 text-center text-xs text-sand-dim/60">
                      {enDirect
                        ? "Charge un avatar pour démarrer la transformation."
                        : "Mode hors ligne : pas de flux transformé en direct."}
                    </p>
                  )}
                </div>

                {erreurCamera && (
                  <p className="mt-2 text-xs text-ember">{erreurCamera}</p>
                )}
              </div>
            ) : avatarSource ? (
              <div className="flex h-full flex-col">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-mirage">
                  Transformation
                </p>
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-ink">
                  {enTraitement ? (
                    <div className="flex flex-col items-center gap-3">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-mirage/25 border-t-mirage" />
                      <p className="text-xs text-sand-dim">Génération en cours…</p>
                    </div>
                  ) : resultat ? (
                    <img
                      src={resultat}
                      alt="Résultat"
                      className="max-h-full max-w-full object-contain animate-[fade-up_0.4s_ease-out]"
                    />
                  ) : (
                    <p className="px-4 text-center text-xs text-sand-dim/60">
                      Le résultat apparaîtra ici.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sand-dim/20 text-2xl text-sand-dim">
                  ◎
                </span>
                <p className="text-sm text-sand-dim">
                  Charge un avatar, puis démarre la caméra.
                </p>
                {erreurCamera && (
                  <p className="text-xs text-ember">{erreurCamera}</p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Barre inférieure */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t border-sand-dim/15 bg-umber/70 backdrop-blur-md px-6 py-3 transition-opacity duration-500 delay-300 ${
            monte ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select
              onChange={(e) => demarrerCamera(e.target.value)}
              className="rounded-lg border border-sand-dim/20 bg-ink px-3 py-1.5 text-sand-dim outline-none transition-colors focus:border-mirage"
            >
              <option value="">Sélectionner une caméra…</option>
              {peripheriques.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || "Caméra"}
                </option>
              ))}
            </select>
            <select className="rounded-lg border border-sand-dim/20 bg-ink px-3 py-1.5 text-sand-dim outline-none transition-colors focus:border-mirage">
              <option>480p</option>
              <option>720p</option>
              <option>1080p</option>
            </select>
            <button className="rounded-lg border border-sand-dim/20 px-3 py-1.5 text-sand-dim transition-colors duration-200 hover:border-mirage hover:text-sand">
              Détecter
            </button>
          </div>

          <button
            onClick={toggleCamera}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
              cameraActive
                ? "border border-sand-dim/25 bg-ink text-sand hover:border-ember hover:text-ember"
                : "bg-ember text-ink hover:opacity-90 hover:shadow-[0_0_24px_-6px_theme(colors.ember)]"
            }`}
          >
            {cameraActive ? "Arrêter la caméra" : "Démarrer la caméra"}
          </button>
        </div>

        {/* Section marketing — accroche animée */}
        <section className="relative overflow-hidden border-t border-sand-dim/15 bg-gradient-to-br from-umber/40 via-ink/40 to-umber/40 backdrop-blur-sm px-6 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-mirage/20 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-ember/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
              Pourquoi nous choisir
            </p>

            <p
              key={indexPhrase}
              className="mt-4 min-h-[3.5rem] font-display text-2xl italic text-sand animate-[fade-up_0.5s_ease-out] sm:text-3xl"
            >
              {phrasesMarketing[indexPhrase]}
            </p>

            <div className="mt-3 flex justify-center gap-1.5">
              {phrasesMarketing.map((_, i) => {
                const couleursPoints = ["mirage", "ember", "jaune", "violet"];
                const couleur = couleursPoints[i % couleursPoints.length];
                return (
                  <button
                    key={i}
                    onClick={() => setIndexPhrase(i)}
                    aria-label={`Voir la phrase ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 bg-${couleur} ${
                      i === indexPhrase ? "w-6 opacity-100" : "w-1.5 opacity-30"
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 p-4 backdrop-blur">
                <p className="font-display text-xl text-mirage">Temps réel</p>
                <p className="mt-1 text-xs text-sand-dim">
                  Transformation instantanée, sans latence perceptible.
                </p>
              </div>
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 p-4 backdrop-blur">
                <p className="font-display text-xl text-ember">Une seule photo</p>
                <p className="mt-1 text-xs text-sand-dim">
                  Charge un avatar, et c'est parti — aucun réglage complexe.
                </p>
              </div>
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 p-4 backdrop-blur">
                <p className="font-display text-xl text-violet">100% navigateur</p>
                <p className="mt-1 text-xs text-sand-dim">
                  Rien à installer. Fonctionne directement depuis ta caméra.
                </p>
              </div>
            </div>

            <button
              onClick={() => avatarInputRef.current?.click()}
              className="mt-10 rounded-full bg-ember px-8 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_32px_-8px_theme(colors.ember)]"
            >
              Essayer maintenant — c'est gratuit
            </button>
          </div>
        </section>

        {/* Tarifs — visible en scrollant en bas du dashboard */}
        <section id="tarifs" className="border-t border-sand-dim/15 px-6 py-16">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
              Recharge ton temps
            </p>
            <h2 className="mt-2 font-display text-3xl italic sm:text-4xl">
              Choisis{" "}
              <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-jaune via-violet to-mirage animate-[text-shimmer_5s_linear_infinite]">
                ton offre
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-sand-dim">
              Le temps que tu achètes correspond à la durée totale de transformation en
              temps réel (le compteur ne tourne que quand ta caméra est active en mode
              Direct). Une fois épuisé, recharge en quelques secondes pour continuer.
            </p>

            {/* Explication rapide en 3 points */}
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 backdrop-blur-md p-4">
                <p className="font-mono text-xs text-mirage">01</p>
                <p className="mt-2 text-sm text-sand-dim">
                  Le temps se décompte uniquement pendant que le swap est actif — pas
                  quand tu prépares ton avatar ou règles ta caméra.
                </p>
              </div>
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 backdrop-blur-md p-4">
                <p className="font-mono text-xs text-ember">02</p>
                <p className="mt-2 text-sm text-sand-dim">
                  Chaque offre a une durée de validité propre, de 5 à 365 jours
                  selon le pack choisi — passé ce délai, le temps non utilisé
                  de cette offre expire.
                </p>
              </div>
              <div className="carte-animee rounded-xl border border-sand-dim/15 bg-umber/60 backdrop-blur-md p-4">
                <p className="font-mono text-xs text-violet">03</p>
                <p className="mt-2 text-sm text-sand-dim">
                  Tu peux recharger à tout moment, même en pleine session — le temps
                  s'additionne automatiquement à ton solde.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {OFFRES.map((offre) => {
                const accent = offre.couleur;
                // Le violet est trop sombre pour du texte "ink" (noir) — on garde
                // ink sur mirage/ember/jaune mais on passe en blanc sur violet.
                const texteBadge = "text-ink";
                return (
                  <div
                    key={offre.id}
                    className={`carte-animee group relative overflow-hidden rounded-[2rem] border-2 p-7 text-left transition-all duration-300 hover:-translate-y-1 border-${accent}/50`}
                    style={{
                      background:
                        "radial-gradient(140% 140% at 0% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)",
                    }}
                  >
                    {/* Lueur douce en fond, pas de bordure rectangulaire */}
                    <div
                      className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300 opacity-30 group-hover:opacity-50 bg-${accent}`}
                    />

                    {/* Durée de validité — coin haut droit de la carte */}
                    <span
                      className={`absolute top-5 right-5 font-mono text-xs font-bold text-${accent}`}
                    >
                      {offre.dureeValiditeJours}jours
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${texteBadge} bg-${accent}`}
                    >
                      {offre.badge}
                    </span>

                    <p className="mt-4 font-display text-2xl italic">{offre.titre}</p>
                    <p className={`text-xl font-bold text-${accent}`}>{offre.duree}</p>
                    <p className="text-xs text-sand-dim">de transformation</p>

                    <p className={`mt-3 font-mono text-3xl text-${accent}`}>
                      {offre.uniteFCFA}
                    </p>

                    {/* Liste des fonctionnalités de l'offre, remplace l'ancien texte descriptif */}
                    <ul className="mt-5 space-y-1.5">
                      {offre.fonctionnalites.map((fonctionnalite, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-sand-dim">
                          <span className={`mt-0.5 flex-shrink-0 text-${accent}`}>✓</span>
                          <span>{fonctionnalite}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => ouvrirModalAvecOffre(offre.id)}
                      className={`mt-6 w-full rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 ${texteBadge} bg-${accent}`}
                    >
                      Choisir cette offre
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bloc "Tous les paiements acceptés" — rectangle */}
            <div className="carte-animee mt-12 rounded-2xl border border-mirage/25 bg-umber/60 backdrop-blur-md p-8 shadow-[0_0_40px_-12px_theme(colors.mirage)]">
              <p className="font-mono text-xs uppercase tracking-widest text-mirage">
                Nous acceptons tous les paiements
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                {MOYENS_PAIEMENT.map((moyen) => (
                  <div key={moyen.id} className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-ink ring-1 ring-sand-dim/15 sm:h-20 sm:w-20">
                      <img src={moyen.logo} alt={moyen.nom} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xs text-sand-dim">{moyen.nom}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-sand-dim/70">
                Paiement sécurisé, activation automatique dès la confirmation.
              </p>
            </div>
          </div>
        </section>

        {/* Programme d'affiliation */}
        <Affiliation utilisateur={utilisateur} />

        {/* Modal de recharge */}
        {modalRechargeOuvert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 backdrop-blur-sm"
            onClick={fermerModalRecharge}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-sand-dim/15 bg-umber p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl italic">
                  Recharger{" "}
                  <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-ember to-violet animate-[text-shimmer_5s_linear_infinite]">
                    ton temps
                  </span>
                </h2>
                <button
                  onClick={fermerModalRecharge}
                  className="text-sand-dim transition-colors hover:text-sand"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>

              {etapeModal === "offres" ? (
                <>
                  <p className="mt-1 text-sm text-sand-dim">Choisis ton offre.</p>

                  <div className="mt-5 space-y-2">
                    {OFFRES.map((offre) => (
                      <button
                        key={offre.id}
                        onClick={() => choisirOffreDansModal(offre.id)}
                        className="flex w-full items-center justify-between rounded-xl border border-sand-dim/15 px-4 py-3 text-left transition-colors duration-200 hover:border-sand-dim/30"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-lg font-bold text-${offre.couleur}`}>
                              {offre.duree}
                            </span>
                            {offre.populaire && (
                              <span className="rounded-full bg-ember px-2 py-0.5 text-[10px] font-medium text-ink">
                                Populaire
                              </span>
                            )}
                          </div>
                          <span className={`font-mono text-sm font-bold text-${offre.couleur}`}>
                            {offre.dureeValiditeJours}jours
                          </span>
                        </div>
                        <span className="font-mono text-mirage">{offre.uniteFCFA}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Rappel joli du pack déjà choisi */}
                  {offreChoisie && (
                    <div
                      className={`carte-animee relative mt-4 overflow-hidden rounded-2xl border p-4 border-${offreChoisie.couleur}/40`}
                      style={{
                        background:
                          "radial-gradient(140% 140% at 0% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
                      }}
                    >
                      <div
                        className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-30 bg-${offreChoisie.couleur}`}
                      />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="font-display text-lg italic">{offreChoisie.titre}</p>
                          <p className={`font-mono text-sm font-bold text-${offreChoisie.couleur}`}>
                            {offreChoisie.duree} · {offreChoisie.dureeValiditeJours}jours
                          </p>
                        </div>
                        <p className={`font-mono text-2xl font-extrabold text-${offreChoisie.couleur}`}>
                          {offreChoisie.uniteFCFA}
                        </p>
                      </div>
                      <button
                        onClick={() => setEtapeModal("offres")}
                        className="relative mt-2 text-xs text-sand-dim underline-offset-2 transition-colors hover:text-sand hover:underline"
                      >
                        Changer d&apos;offre
                      </button>
                    </div>
                  )}

                  <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-jaune">
                    Choisis ton moyen de paiement
                  </p>
                  <p className="mt-1 text-xs text-sand-dim">
                    Tu es redirigé vers la page de paiement, ton temps est
                    crédité automatiquement une fois payé.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {MOYENS_PAIEMENT.map((moyen) => (
                      <button
                        key={moyen.id}
                        onClick={() => payerAvec(moyen)}
                        disabled={!moyen.automatise || envoiDemandeEnCours}
                        className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border px-3 py-4 text-sm transition-all duration-200 ${
                          moyen.automatise
                            ? "border-sand-dim/15 text-sand hover:-translate-y-0.5 hover:border-mirage hover:shadow-[0_0_20px_-8px_theme(colors.mirage)] disabled:opacity-60"
                            : "cursor-not-allowed border-sand-dim/10 text-sand-dim/40"
                        }`}
                      >
                        <img
                          src={moyen.logo}
                          alt={moyen.nom}
                          className={`h-9 w-9 rounded-full object-cover ${
                            moyen.automatise ? "" : "grayscale opacity-50"
                          }`}
                        />
                        <span>{moyen.nom}</span>
                        {!moyen.automatise && (
                          <span className="absolute top-1.5 right-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[9px] text-sand-dim">
                            Bientôt
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}