// lib/paiementConfig.js
//
// Données partagées entre les différentes pages du parcours de paiement
// (/paiement, /paiement/[pack]/reseau, /paiement/[pack]/[moyen],
// /paiement/[pack]/confirmation) — pour ne pas dupliquer ces infos
// dans chaque fichier.

export const NUMERO_WHATSAPP = "2250151596980"; // preuves de paiement

export const OFFRES = [
  { id: "10k", titre: "Pack Découverte", prix: 10000, uniteFCFA: "10 000 F" },
  { id: "20k", titre: "Pack Pass Dja", prix: 20000, uniteFCFA: "20 000 F" },
  { id: "40k", titre: "Pack Studio Live", prix: 40000, uniteFCFA: "40 000 F" },
  { id: "60k", titre: "Pack VIP", prix: 60000, uniteFCFA: "60 000 F" },
  { id: "100k", titre: "Pack Prestige", prix: 100000, uniteFCFA: "100 000 F" },
];

// Lien Wave Business par pack — le montant est déjà dans l'URL.
export const LIENS_WAVE = {
  "10k": "https://pay.wave.com/m/M_ci_0OZPGgf8VETj/c/ci/?amount=10000",
  "20k": "https://pay.wave.com/m/M_ci_0OZPGgf8VETj/c/ci/?amount=20000",
  "40k": "https://pay.wave.com/m/M_ci_0OZPGgf8VETj/c/ci/?amount=40000",
  "60k": "https://pay.wave.com/m/M_ci_0OZPGgf8VETj/c/ci/?amount=60000",
  "100k": "https://pay.wave.com/m/M_ci_0OZPGgf8VETj/c/ci/?amount=100000",
};

// Opérateurs à paiement manuel : on affiche le numéro, l'utilisateur
// confirme dans l'app (ce qui crée la demande en base), puis envoie sa
// preuve sur WhatsApp.
export const OPERATEURS_MANUELS = {
  orange: {
    id: "orange",
    nom: "Orange Money",
    numero: "0767369525",
    logo: "/logos/L1.jpeg",
    moyenPaiementLabel: "Orange Money",
  },
  mtn: {
    id: "mtn",
    nom: "MTN Mobile Money",
    numero: "0594934008",
    logo: "/logos/L3.jpeg",
    moyenPaiementLabel: "MTN Mobile Money",
  },
  moov: {
    id: "moov",
    nom: "Moov Money",
    numero: "2250151596980",
    logo: "/logos/L4.jpeg",
    moyenPaiementLabel: "Moov Money",
  },
};

export const MOYENS_PAIEMENT = [
  { id: "wave", nom: "Wave", logo: "/logos/L2.jpeg" },
  ...Object.values(OPERATEURS_MANUELS),
  { id: "djamo", nom: "Djamo", logo: "/logos/L5.jpeg", bientot: true },
];

export function trouverOffre(packId) {
  return OFFRES.find((o) => o.id === packId) || null;
}