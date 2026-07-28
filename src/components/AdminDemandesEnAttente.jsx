"use client";

import { useState, useEffect, useCallback } from "react";

function formaterMontant(fcfa) {
  return new Intl.NumberFormat("fr-FR").format(fcfa) + " F";
}

function formaterDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tempsEcoule(iso) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures}h`;
  return `il y a ${Math.floor(heures / 24)}j`;
}

// Couleurs standards à fort contraste (pas les teintes pâles du thème
// sombre "mirage/ember/violet") — indispensable sur fond clair #f6f0e2.
const COULEURS_MOYEN = {
  wave: "bg-cyan-100 text-cyan-900 border border-cyan-300",
  orange_money: "bg-orange-100 text-orange-900 border border-orange-300",
  mtn: "bg-yellow-100 text-yellow-900 border border-yellow-300",
  moov: "bg-blue-100 text-blue-900 border border-blue-300",
};

function badgeMoyen(moyen) {
  return COULEURS_MOYEN[moyen] || "bg-neutral-200 text-neutral-900 border border-neutral-300";
}

function libelleMoyen(moyen) {
  const libelles = {
    wave: "Wave",
    orange_money: "Orange Money",
    mtn: "MTN Mobile Money",
    moov: "Moov",
  };
  return libelles[moyen] || moyen;
}

async function appelApi(chemin, options = {}) {
  const reponse = await fetch(chemin, options);
  const corps = await reponse.json();
  if (!reponse.ok) throw new Error(corps.erreur || "Erreur inconnue.");
  return corps;
}

export default function AdminDemandesEnAttente() {
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [enCoursId, setEnCoursId] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [rafraichissement, setRafraichissement] = useState(false);

  const charger = useCallback(async (silencieux = false) => {
    if (silencieux) setRafraichissement(true);
    else setChargement(true);
    setErreur(null);
    try {
      const data = await appelApi("/api/admin/demandes");
      setDemandes(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
      setRafraichissement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const valider = async (demandeId) => {
    setEnCoursId(demandeId);
    setErreur(null);
    try {
      await appelApi("/api/admin/valider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandeId }),
      });
      setDemandes((prev) => prev.filter((d) => d.id !== demandeId));
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnCoursId(null);
    }
  };

  const totalFcfa = demandes.reduce((s, d) => s + d.montant_fcfa, 0);

  return (
    <div className="mt-8">
      {/* Cartes-stats — texte noir/couleurs vives foncées, fond blanc pur */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-blue-600 bg-white p-5 shadow-sm">
          <p className="font-mono text-3xl font-black text-blue-700">
            {demandes.length}
          </p>
          <p className="mt-1 text-sm font-bold text-black">
            demande{demandes.length > 1 ? "s" : ""} en attente
          </p>
        </div>

        <div className="rounded-xl border-2 border-red-600 bg-white p-5 shadow-sm">
          <p className="font-mono text-3xl font-black text-red-700">
            {formaterMontant(totalFcfa)}
          </p>
          <p className="mt-1 text-sm font-bold text-black">à valider</p>
        </div>

        <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
          <button
            onClick={() => charger(true)}
            disabled={rafraichissement}
            className="flex items-center gap-2 rounded-full border-2 border-purple-700 bg-white px-4 py-2.5 text-sm font-bold text-purple-800 shadow-sm transition-all duration-200 hover:bg-purple-50 disabled:opacity-50"
          >
            <span className={rafraichissement ? "animate-spin" : ""}>↻</span>
            Rafraîchir
          </button>
        </div>
      </div>

      {erreur && (
        <p className="mt-4 rounded-lg border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          {erreur}
        </p>
      )}

      {/* Contenu */}
      <div className="mt-6">
        {chargement ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        ) : demandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-400 bg-white py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-600 text-xl text-green-700">
              ✓
            </span>
            <p className="text-sm font-bold text-black">
              Aucune demande en attente — tout est à jour.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border-2 border-neutral-400 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-neutral-400 bg-neutral-100 text-xs font-black uppercase tracking-wide text-black">
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Pack</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Moyen</th>
                  <th className="px-4 py-3">Soumis</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-neutral-200 bg-white transition-colors duration-150 last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-base font-semibold text-black">
                      {d.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-blue-400 bg-blue-100 px-3 py-1 text-sm font-bold text-blue-900">
                        {d.pack_id}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-base font-black text-red-700">
                      {formaterMontant(d.montant_fcfa)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-sm font-bold ${badgeMoyen(d.moyen_paiement)}`}>
                        {libelleMoyen(d.moyen_paiement)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-semibold text-black/80"
                      title={formaterDate(d.created_at)}
                    >
                      {tempsEcoule(d.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => valider(d.id)}
                        disabled={enCoursId === d.id}
                        className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-red-700 disabled:opacity-50"
                      >
                        {enCoursId === d.id ? "…" : "Valider"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-black/80">
        <span className="mt-0.5">⚠️</span>
        <span>
          Cette liste montre qui a déclaré avoir payé, pas une confirmation
          automatique du paiement — vérifie toujours la preuve (capture
          WhatsApp/e-mail) avant de cliquer sur "Valider".
        </span>
      </p>
    </div>
  );
}