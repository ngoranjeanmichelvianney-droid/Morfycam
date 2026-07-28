"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import Logo from "@/components/Logo";

export default function Sidebar() {
  const router = useRouter();
  const [utilisateur, setUtilisateur] = useState(null);
  const [modeSombre, setModeSombre] = useState(true);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUtilisateur(data.user));
    setMonte(true);
  }, []);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={`flex w-64 shrink-0 flex-col justify-between border-r border-sand-dim/15 bg-umber px-5 py-6 text-sand transition-opacity duration-500 ${
        monte ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <Logo taille={32} />

        <nav className="mt-9 space-y-1">
          <div className="flex items-center gap-2.5 rounded-lg bg-ink px-3 py-2.5 text-sm font-medium text-sand transition-colors duration-200">
            <span className="h-1.5 w-1.5 rounded-full bg-mirage" />
            Tableau de bord
          </div>
          <a
            href="/dashboard#tarifs"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-sand-dim transition-colors duration-200 hover:bg-ink/50 hover:text-sand"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sand-dim/40" />
            Facturation
          </a>
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-sand-dim transition-colors duration-200 hover:bg-ink/50 hover:text-sand">
            <span className="h-1.5 w-1.5 rounded-full bg-sand-dim/40" />
            Contactez-nous
          </div>
        </nav>

        <button className="mt-4 w-full rounded-full bg-ember px-4 py-2 text-sm font-medium text-ink transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_20px_-4px_theme(colors.ember)]">
          Passer en Pro
        </button>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-sand-dim">Thème sombre</span>
          <button
            onClick={() => setModeSombre((v) => !v)}
            className={`h-5 w-9 rounded-full transition-colors duration-300 ${modeSombre ? "bg-mirage" : "bg-sand-dim/25"}`}
          >
            <span
              className={`block h-4 w-4 translate-y-0.5 rounded-full bg-ink transition-transform duration-300 ${
                modeSombre ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleDeconnexion}
        className="text-left text-sm text-sand-dim transition-colors duration-200 hover:text-ember"
      >
        Se déconnecter
      </button>
    </aside>
  );
}