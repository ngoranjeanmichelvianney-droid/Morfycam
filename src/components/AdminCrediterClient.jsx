"use client";

import { useState } from "react";

// Doit matcher public.packs en base (id, secondes, prix_fcfa).
// Affiché ici seulement pour le libellé — la vraie donnée utilisée
// pour créditer vient de la table lors de l'appel RPC côté serveur.
const PACKS_AFFICHAGE = [
  { id: "10k", label: "10 000 F — 6 min 20" },
  { id: "20k", label: "20 000 F — 12 min 40" },
  { id: "40k", label: "40 000 F — 25 min 20" },
  { id: "60k", label: "60 000 F — 38 min" },
  { id: "100k", label: "100 000 F — 63 min 20" },
];

function formaterSecondes(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m} min ${s.toString().padStart(2, "0")}s`;
}

export default function AdminCrediterClient() {
  const [email, setEmail] = useState("");
  const [recherche, setRecherche] = useState(false);
  const [utilisateurTrouve, setUtilisateurTrouve] = useState(null);
  const [erreur, setErreur] = useState(null);

  const [packChoisi, setPackChoisi] = useState(PACKS_AFFICHAGE[0].id);
  const [note, setNote] = useState("");
  const [creditEnCours, setCreditEnCours] = useState(false);
  const [messageSucces, setMessageSucces] = useState(null);

  // Les cookies de session partent automatiquement avec fetch (même
  // origine) — plus besoin de gérer un token à la main.
  const appelApi = async (chemin, options = {}) => {
    const reponse = await fetch(chemin, options);
    const corps = await reponse.json();
    if (!reponse.ok) {
      throw new Error(corps.erreur || "Erreur inconnue.");
    }
    return corps;
  };

  const chercherUtilisateur = async (e) => {
    e.preventDefault();
    setErreur(null);
    setMessageSucces(null);
    setUtilisateurTrouve(null);
    setRecherche(true);
    try {
      const data = await appelApi(
        `/api/admin/utilisateur?email=${encodeURIComponent(email.trim())}`
      );
      setUtilisateurTrouve(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setRecherche(false);
    }
  };

  const crediter = async () => {
    if (!utilisateurTrouve) return;
    setErreur(null);
    setMessageSucces(null);
    setCreditEnCours(true);
    try {
      await appelApi("/api/admin/crediter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilisateurId: utilisateurTrouve.id,
          packId: packChoisi,
          note: note.trim() || undefined,
        }),
      });
      setMessageSucces(`Pack ${packChoisi} crédité à ${utilisateurTrouve.email}.`);
      setNote("");
      const data = await appelApi(
        `/api/admin/utilisateur?email=${encodeURIComponent(utilisateurTrouve.email)}`
      );
      setUtilisateurTrouve(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setCreditEnCours(false);
    }
  };

  return (
    <>
      <form onSubmit={chercherUtilisateur} className="mt-8 flex max-w-md gap-2">
        <input
          type="email"
          required
          placeholder="email@utilisateur.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-sand-dim/20 bg-umber px-3 py-2 text-sm outline-none focus:border-mirage"
        />
        <button
          type="submit"
          disabled={recherche}
          className="rounded-lg bg-mirage px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
        >
          {recherche ? "Recherche…" : "Chercher"}
        </button>
      </form>

      {erreur && <p className="mt-4 text-sm text-ember">{erreur}</p>}
      {messageSucces && <p className="mt-4 text-sm text-mirage">✓ {messageSucces}</p>}

      {utilisateurTrouve && (
        <div className="mt-6 max-w-md rounded-xl border border-sand-dim/15 bg-umber p-5">
          <p className="text-sm text-sand-dim">Utilisateur</p>
          <p className="font-mono text-lg">{utilisateurTrouve.email}</p>
          <p className="mt-1 text-sm text-sand-dim">
            Solde actuel :{" "}
            <span className="text-mirage">
              {formaterSecondes(utilisateurTrouve.solde_secondes)}
            </span>
          </p>
          <p className="mt-1 text-xs text-sand-dim/60">
            Code parrainage : {utilisateurTrouve.code_parrainage}
          </p>

          <div className="mt-5 border-t border-sand-dim/10 pt-5">
            <label className="block text-xs uppercase tracking-widest text-sand-dim/70">
              Pack à créditer
            </label>
            <select
              value={packChoisi}
              onChange={(e) => setPackChoisi(e.target.value)}
              className="mt-2 w-full rounded-lg border border-sand-dim/20 bg-ink px-3 py-2 text-sm outline-none focus:border-mirage"
            >
              {PACKS_AFFICHAGE.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <label className="mt-3 block text-xs uppercase tracking-widest text-sand-dim/70">
              Note (optionnel — ex: référence transaction)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ex: Wave #4521, capture reçue 14h32"
              className="mt-2 w-full rounded-lg border border-sand-dim/20 bg-ink px-3 py-2 text-sm outline-none focus:border-mirage"
            />

            <button
              onClick={crediter}
              disabled={creditEnCours}
              className="mt-4 w-full rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-50"
            >
              {creditEnCours ? "Crédit en cours…" : "Créditer en 1 clic"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}