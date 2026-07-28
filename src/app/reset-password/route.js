"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);
    const { error } = await supabase.auth.updateUser({ password: motDePasse });
    setChargement(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    setSucces(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-2 text-2xl font-bold text-white">Nouveau mot de passe</h1>
      <p className="mb-6 text-sm text-sand-dim">
        Choisis un nouveau mot de passe pour ton compte.
      </p>

      {succes ? (
        <p className="rounded-lg bg-green-950/40 p-4 text-sm text-green-400">
          Mot de passe mis à jour ! Redirection vers la connexion...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Nouveau mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full rounded-lg border border-sand-dim/25 bg-umber px-4 py-2.5 text-sm text-white outline-none focus:border-mirage"
          />
          <input
            type="password"
            required
            placeholder="Confirme le mot de passe"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full rounded-lg border border-sand-dim/25 bg-umber px-4 py-2.5 text-sm text-white outline-none focus:border-mirage"
          />

          {erreur && <p className="text-sm text-ember">{erreur}</p>}

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-lg bg-gradient-to-r from-mirage to-violet px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {chargement ? "Mise à jour..." : "Réinitialiser mon mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}