"use client";

import { useState, useEffect, useCallback } from "react";

function formaterMontant(fcfa) {
  return new Intl.NumberFormat("fr-FR").format(fcfa) + " F";
}

function formaterDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const BADGES_MOYEN = {
  manuel: { label: "Manuel", classe: "bg-purple-100 text-purple-900 border border-purple-300" },
  wave: { label: "Wave", classe: "bg-cyan-100 text-cyan-900 border border-cyan-300" },
  orange_money: { label: "Orange Money", classe: "bg-orange-100 text-orange-900 border border-orange-300" },
};

const BADGES_STATUT = {
  validee: { label: "Validée", classe: "bg-green-100 text-green-900 border border-green-300" },
  expiree: { label: "Expirée", classe: "bg-neutral-200 text-neutral-800 border border-neutral-400" },
  erreur: { label: "Erreur", classe: "bg-red-100 text-red-900 border border-red-300" },
};

async function appelApi(chemin) {
  const reponse = await fetch(chemin);
  const corps = await reponse.json();
  if (!reponse.ok) throw new Error(corps.erreur || "Erreur inconnue.");
  return corps;
}

export default function AdminHistorique() {
  const [historique, setHistorique] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const data = await appelApi("/api/admin/historique");
      setHistorique(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <div className="mt-4">
      {chargement ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-200" />
          ))}
        </div>
      ) : erreur ? (
        <p className="rounded-lg border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          {erreur}
        </p>
      ) : historique.length === 0 ? (
        <p className="py-8 text-center text-sm font-semibold text-black/70">
          Aucune recharge traitée pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border-2 border-neutral-400 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-400 bg-neutral-100 text-xs font-black uppercase tracking-wide text-black">
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Pack</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Origine</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {historique.map((h) => {
                const badgeMoyen = BADGES_MOYEN[h.moyen_paiement] || {
                  label: h.moyen_paiement,
                  classe: "bg-neutral-200 text-neutral-900 border border-neutral-400",
                };
                const badgeStatut = BADGES_STATUT[h.statut] || {
                  label: h.statut,
                  classe: "bg-neutral-200 text-neutral-900 border border-neutral-400",
                };
                return (
                  <tr
                    key={h.id}
                    className="border-b border-neutral-200 bg-white last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-black">
                      {h.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-blue-400 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
                        {h.pack_id}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm font-black text-red-700">
                      {formaterMontant(h.montant_fcfa)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeMoyen.classe}`}>
                        {badgeMoyen.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStatut.classe}`}>
                        {badgeStatut.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-black/70">
                      {formaterDate(h.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}