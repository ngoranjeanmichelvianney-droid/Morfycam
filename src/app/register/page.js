"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";
import Logo from "@/components/Logo";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [messageConfirmation, setMessageConfirmation] = useState("");

  // Code de parrainage récupéré depuis l'URL (ex: /inscription?ref=ABCD1234),
  // généré par le lien de partage sur la page Affiliation. On le garde en
  // state plutôt que de relire searchParams à chaque submit, au cas où le
  // composant Affiliation le mettrait à jour ailleurs plus tard.
  const [codeParrain, setCodeParrain] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setCodeParrain(ref.toUpperCase());
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      setChargement(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: {
          nom_affichage: nom,
          // Lu par le trigger SQL gerer_nouvel_utilisateur() pour relier
          // ce compte à son parrain dans la table profils.
          code_parrain: codeParrain || null,
        },
      },
    });

    setChargement(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setErreur("Un compte existe déjà avec cet email.");
      } else {
        setErreur("Une erreur est survenue. Réessaie.");
      }
      return;
    }

    if (data.session) {
      router.push("/dashboard");
    } else {
      setMessageConfirmation(
        "Compte créé. Vérifie ta boîte mail pour confirmer ton adresse avant de te connecter."
      );
    }
  }

  async function handleOAuth(provider) {
    setErreur("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Le code de parrainage transite dans l'URL de callback, car le
        // flux OAuth ne passe pas par data/options comme signUp — c'est
        // /auth/callback qui devra le lire et l'écrire dans profils.
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard${
          codeParrain ? `&ref=${codeParrain}` : ""
        }`,
      },
    });

    if (error) {
      setErreur("Impossible de continuer avec ce fournisseur.");
    }
  }

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
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-50px, 50px) scale(1.1); }
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
      `}</style>

      <main className="animated-bg relative flex min-h-screen items-center justify-center px-6 text-sand">
        <div className="orb-1" />
        <div className="orb-2" />

        <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <Logo />

          <h1 className="mt-8 font-display text-3xl italic">Crée ton compte</h1>
          <p className="mt-2 text-sm text-sand-dim">
            Quelques secondes suffisent pour commencer à transformer ton image.
          </p>

          {messageConfirmation ? (
            <div className="mt-8 rounded-lg border border-mirage/40 bg-white/5 p-4 text-sm text-mirage">
              {messageConfirmation}
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="nom" className="font-mono text-xs uppercase tracking-widest text-sand-dim">
                    Nom affiché
                  </label>
                  <input
                    id="nom"
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-sand-dim/25 bg-white/5 px-4 py-2.5 text-sand outline-none focus:border-mirage transition"
                    placeholder="Ton pseudo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-sand-dim">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-sand-dim/25 bg-white/5 px-4 py-2.5 text-sand outline-none focus:border-mirage transition"
                    placeholder="toi@exemple.com"
                  />
                </div>

                <div>
                  <label htmlFor="mot-de-passe" className="font-mono text-xs uppercase tracking-widest text-sand-dim">
                    Mot de passe
                  </label>
                  <input
                    id="mot-de-passe"
                    type="password"
                    required
                    minLength={6}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-sand-dim/25 bg-white/5 px-4 py-2.5 text-sand outline-none focus:border-mirage transition"
                    placeholder="6 caractères minimum"
                  />
                </div>

                <div>
                  <label htmlFor="code-parrain" className="font-mono text-xs uppercase tracking-widest text-sand-dim">
                    Code de parrainage <span className="normal-case text-sand-dim/60">(optionnel)</span>
                  </label>
                  <input
                    id="code-parrain"
                    type="text"
                    value={codeParrain}
                    onChange={(e) => setCodeParrain(e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-lg border border-sand-dim/25 bg-white/5 px-4 py-2.5 text-sand outline-none focus:border-mirage transition uppercase placeholder:normal-case placeholder:text-sand-dim/50"
                    placeholder="Un ami t'a invité ? Colle son code ici"
                  />
                </div>

                {erreur && <p className="text-sm text-ember">{erreur}</p>}

                <button
                  type="submit"
                  disabled={chargement}
                  className="w-full rounded-full bg-ember px-6 py-3 font-medium text-ink hover:opacity-90 transition disabled:opacity-50"
                >
                  {chargement ? "Création..." : "Créer mon compte"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-sand-dim/15" />
                <span className="font-mono text-xs uppercase tracking-widest text-sand-dim">ou</span>
                <div className="h-px flex-1 bg-sand-dim/15" />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-sand-dim/25 bg-white/5 px-6 py-2.5 text-sm font-medium text-sand transition hover:border-mirage"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 01-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0012 24z" />
                    <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 010-4.56V6.61H1.27a12 12 0 000 10.78l4-3.11z" />
                    <path fill="#EA4335" d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 001.27 6.61l4 3.11C6.22 6.87 8.87 4.76 12 4.76z" />
                  </svg>
                  Continuer avec Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth("github")}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-sand-dim/25 bg-white/5 px-6 py-2.5 text-sm font-medium text-sand transition hover:border-mirage"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-sand">
                    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.87 10.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Continuer avec GitHub
                </button>
              </div>
            </>
          )}

          <p className="mt-6 text-sm text-sand-dim">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-mirage hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}