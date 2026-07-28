"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setChargement(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    setEnvoye(true);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-2 text-2xl font-bold text-white">Mot de passe oublié</h1>
      <p className="mb-6 text-sm text-sand-dim">
        Entre ton email, on t'envoie un lien pour en choisir un nouveau.
      </p>

      {envoye ? (
        <p className="rounded-lg bg-green-950/40 p-4 text-sm text-green-400">
          Email envoyé ! Vérifie ta boîte de réception (et les spams).
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-sand-dim/25 bg-umber px-4 py-2.5 text-sm text-white outline-none focus:border-mirage"
          />

          {erreur && <p className="text-sm text-ember">{erreur}</p>}

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-lg bg-gradient-to-r from-mirage to-violet px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {chargement ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      )}
    </div>
  );
}