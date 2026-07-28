"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

// Seuil minimum de paiement du filleul pour déclencher une récompense de
// parrainage (le Pack Découverte à 10 000 F n'est donc pas éligible), et
// pourcentage du temps du pack acheté reversé au parrain — ajuste ces
// valeurs selon ton modèle économique. Garde-les synchronisées avec la
// table `packs` et la fonction `valider_recharge` côté Supabase.
const SEUIL_PAIEMENT_FCFA = 20000;
const POURCENTAGE_PARRAINAGE = 0.1; // 10% du temps du pack acheté, quel que soit le pack

// Packs éligibles au parrainage (prix >= SEUIL_PAIEMENT_FCFA), à garder
// synchronisés avec le tableau OFFRES dans Dashboard.jsx et la table
// `packs` en base. Le parrain gagne 10% du temps du pack que SON FILLEUL
// achète — donc plus le filleul recharge gros, plus le parrain gagne.
const PACKS_ELIGIBLES = [
  { id: "20k", uniteFCFA: "20 000 F", secondes: 12 * 60 + 40 },
  { id: "40k", uniteFCFA: "40 000 F", secondes: 25 * 60 + 20 },
  { id: "60k", uniteFCFA: "60 000 F", secondes: 38 * 60 },
  { id: "100k", uniteFCFA: "100 000 F", secondes: 63 * 60 + 20 },
].map((pack) => ({
  ...pack,
  secondesGagnees: Math.round(pack.secondes * POURCENTAGE_PARRAINAGE),
}));

// Formatte une durée courte en minutes/secondes (ex: "1min16s")
function formatDureeCourte(totalSecondes) {
  const total = Math.max(0, Math.round(totalSecondes));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}min${s}s`;
}

/**
 * Section "Programme d'affiliation" : lien de parrainage à partager,
 * et statistiques (filleuls, recharges, minutes gagnées).
 *
 * Props :
 * - utilisateur : l'objet user Supabase (auth), sert seulement à savoir
 *   si quelqu'un est connecté — le code et les stats sont lus en base.
 *
 * Règle de gain : le parrain reçoit 10% du temps du pack acheté par son
 * filleul, uniquement lorsque ce dernier effectue un paiement de 20 000 F
 * ou plus, ET uniquement si le parrain lui-même a déjà payé au moins une
 * recharge (vérifié côté Supabase par valider_recharge — c'est le vrai
 * verrou). Ici, on cache en plus le lien tant que ce n'est pas le cas,
 * pour éviter que quelqu'un partage son lien juste pour tenter sa chance
 * sans jamais avoir payé.
 */
export default function Affiliation({ utilisateur }) {
  const [lienCopie, setLienCopie] = useState(false);
  const [codeAffiliation, setCodeAffiliation] = useState(null);
  const [aDejaPaye, setADejaPaye] = useState(false);
  const [statsAffiliation, setStatsAffiliation] = useState({
    filleulsInscrits: 0,
    recharesEffectuees: 0,
    minutesGagnees: 0,
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!utilisateur?.id) {
      setChargement(false);
      return;
    }

    let annule = false;

    async function chargerDonneesAffiliation() {
      setChargement(true);

      const [
        { data: profil, error: erreurProfil },
        { data: stats, error: erreurStats },
        { data: rechargesValidees, error: erreurRecharges },
      ] = await Promise.all([
        supabase
          .from("profils")
          .select("code_parrainage")
          .eq("id", utilisateur.id)
          .single(),
        supabase
          .from("stats_parrainage")
          .select("filleuls_inscrits, recharges_effectuees, secondes_gagnees")
          .eq("utilisateur_id", utilisateur.id)
          .single(),
        supabase
          .from("demandes_recharge")
          .select("id")
          .eq("utilisateur_id", utilisateur.id)
          .eq("statut", "validee")
          .limit(1),
      ]);

      if (annule) return;

      if (erreurProfil) {
        console.error("Erreur chargement code de parrainage :", erreurProfil);
      } else {
        setCodeAffiliation(profil?.code_parrainage ?? null);
      }

      // stats_parrainage peut ne renvoyer aucune ligne si l'utilisateur n'a
      // encore aucun filleul (la vue est construite avec des jointures) —
      // ce n'est pas une vraie erreur, juste des stats à 0.
      if (erreurStats && erreurStats.code !== "PGRST116") {
        console.error("Erreur chargement stats de parrainage :", erreurStats);
      } else if (stats) {
        setStatsAffiliation({
          filleulsInscrits: stats.filleuls_inscrits ?? 0,
          recharesEffectuees: stats.recharges_effectuees ?? 0,
          minutesGagnees: Math.round((stats.secondes_gagnees ?? 0) / 60),
        });
      }

      if (erreurRecharges) {
        console.error("Erreur vérification des recharges :", erreurRecharges);
      } else {
        setADejaPaye((rechargesValidees ?? []).length > 0);
      }

      setChargement(false);
    }

    chargerDonneesAffiliation();

    return () => {
      annule = true;
    };
  }, [utilisateur?.id]);

  const lienAffiliation =
    typeof window !== "undefined" && codeAffiliation
      ? `${window.location.origin}/inscription?ref=${codeAffiliation}`
      : "";

  async function copierLienAffiliation() {
    if (!lienAffiliation) return;
    try {
      await navigator.clipboard.writeText(lienAffiliation);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    } catch (err) {
      console.error("Impossible de copier le lien :", err);
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-sand-dim/15 bg-umber/60 backdrop-blur-md px-6 py-14">
      {/* Glows colorés en fond, propres à cette section */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-mirage/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-ember/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
          Parraine et gagne
        </p>
        <h2 className="mt-2 font-display text-3xl italic sm:text-4xl">
          Programme{" "}
          <span className="bg-[length:200%_auto] bg-clip-text text-transparent bg-gradient-to-r from-mirage via-ember to-violet animate-[text-shimmer_5s_linear_infinite]">
            d&apos;affiliation
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-sand-dim">
          Plus tes amis rechargent, plus tu gagnes de temps offert — sans
          rien faire de plus que partager ton lien.
        </p>

        {/* Comment ça marche — 3 étapes colorées */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="carte-animee rounded-2xl border border-mirage/30 bg-mirage/10 p-5 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mirage text-sm font-bold text-ink">
              1
            </span>
            <p className="mt-3 text-sm font-semibold text-sand">
              Tu recharges toi-même une première fois
            </p>
            <p className="mt-1 text-xs text-sand-dim">
              Ça débloque ton lien de parrainage personnel.
            </p>
          </div>
          <div className="carte-animee rounded-2xl border border-ember/30 bg-ember/10 p-5 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-sm font-bold text-ink">
              2
            </span>
            <p className="mt-3 text-sm font-semibold text-sand">
              Un ami recharge {SEUIL_PAIEMENT_FCFA.toLocaleString("fr-FR")} F ou plus
            </p>
            <p className="mt-1 text-xs text-sand-dim">
              Il s&apos;inscrit avec ton lien et choisit un pack.
            </p>
          </div>
          <div className="carte-animee rounded-2xl border border-violet/30 bg-violet/10 p-5 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet text-sm font-bold text-ink">
              3
            </span>
            <p className="mt-3 text-sm font-semibold text-sand">
              Tu reçois 10% offerts en bonus
            </p>
            <p className="mt-1 text-xs text-sand-dim">
              Ton ami garde 100% de son pack — ton bonus vient en plus, sans
              rien lui retirer.
            </p>
          </div>
        </div>

        {/* Détail des gains selon le pack acheté par le filleul */}
        <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-jaune">
          Ce que tu gagnes en bonus, sans rien retirer à ton ami
        </p>
        <div className="carte-animee mt-4 grid gap-3 sm:grid-cols-4">
          {PACKS_ELIGIBLES.map((pack, i) => {
            const couleurs = ["mirage", "ember", "jaune", "violet"];
            const accent = couleurs[i % couleurs.length];
            return (
              <div
                key={pack.id}
                className={`rounded-xl border-t-4 bg-ink px-3 py-4 border-${accent}`}
              >
                <p className="text-xs text-sand-dim">Il paie</p>
                <p className={`font-mono text-base font-bold text-${accent}`}>
                  {pack.uniteFCFA}
                </p>
                <p className="mt-3 text-xs text-sand-dim">Tu gagnes</p>
                <p className={`font-mono text-2xl font-extrabold text-${accent}`}>
                  +{formatDureeCourte(pack.secondesGagnees)}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-sand-dim/60">
          Ce bonus est offert par la plateforme, en plus du pack de ton ami —
          il ne perd aucune minute. Le Pack Découverte (10 000 F) n&apos;ouvre
          pas droit au parrainage.
        </p>

        {/* Lien de parrainage — verrouillé tant que l'utilisateur n'a pas
            lui-même effectué au moins une recharge. Le vrai verrou est côté
            Supabase (valider_recharge ne verse aucun bonus sinon) ; ceci
            est la version côté interface, pour ne même pas afficher le
            lien avant que ce soit débloqué. */}
        {utilisateur && !chargement && !aDejaPaye ? (
          <div className="carte-animee mt-10 rounded-2xl border border-sand-dim/20 bg-ink p-6">
            <p className="text-sm font-semibold text-sand">
              Ton lien de parrainage n&apos;est pas encore débloqué
            </p>
            <p className="mt-2 text-xs text-sand-dim">
              Effectue ta première recharge pour débloquer ton lien et
              commencer à gagner du temps en le partageant.
            </p>
            <a
              href="#tarifs"
              className="mt-4 inline-block rounded-full bg-gradient-to-r from-mirage to-ember px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90"
            >
              Voir les offres
            </a>
          </div>
        ) : (
          <>
            <div className="carte-animee mt-10 flex flex-col items-center gap-2 rounded-2xl border border-mirage/25 bg-ink p-4 shadow-[0_0_40px_-16px_theme(colors.mirage)] sm:flex-row sm:gap-3">
              <input
                readOnly
                value={
                  !utilisateur
                    ? "Connecte-toi pour voir ton lien"
                    : chargement
                    ? "Chargement..."
                    : lienAffiliation
                }
                onFocus={(e) => e.target.select()}
                className="w-full flex-1 truncate rounded-lg bg-umber px-4 py-2.5 text-sm text-sand outline-none"
              />
              <button
                onClick={copierLienAffiliation}
                disabled={!lienAffiliation}
                className="w-full shrink-0 rounded-lg bg-gradient-to-r from-mirage to-ember px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:opacity-90 disabled:opacity-50 sm:w-auto"
              >
                {lienCopie ? "Copié ✓" : "Copier le lien"}
              </button>
            </div>
            <p className="mt-2 text-xs text-sand-dim">
              Ton code de parrainage :{" "}
              <span className="font-mono font-semibold text-ember">
                {codeAffiliation || (chargement ? "Chargement..." : "—")}
              </span>
            </p>
          </>
        )}

        {/* Statistiques d'affiliation */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="carte-animee rounded-xl border-t-4 border-mirage bg-ink p-5 shadow-[0_0_30px_-14px_theme(colors.mirage)]">
            <p className="font-mono text-4xl font-extrabold text-mirage">
              {statsAffiliation.filleulsInscrits}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-sand-dim">
              Filleuls inscrits
            </p>
          </div>
          <div className="carte-animee rounded-xl border-t-4 border-ember bg-ink p-5 shadow-[0_0_30px_-14px_theme(colors.ember)]">
            <p className="font-mono text-4xl font-extrabold text-ember">
              {statsAffiliation.recharesEffectuees}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-sand-dim">
              Recharges effectuées
            </p>
          </div>
          <div className="carte-animee rounded-xl border-t-4 border-violet bg-ink p-5 shadow-[0_0_30px_-14px_theme(colors.violet)]">
            <p className="font-mono text-4xl font-extrabold text-violet">
              {statsAffiliation.minutesGagnees}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-sand-dim">
              Minutes gagnées
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
