"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import Logo from "@/components/Logo";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [utilisateur, setUtilisateur] = useState(null);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUtilisateur(data.user));
    const { data: abonnement } = supabase.auth.onAuthStateChange((_event, session) => {
      setUtilisateur(session?.user ?? null);
    });
    return () => abonnement.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function fermerSiClicExterieur(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOuvert(false);
      }
    }
    document.addEventListener("mousedown", fermerSiClicExterieur);
    return () => document.removeEventListener("mousedown", fermerSiClicExterieur);
  }, []);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (["/login", "/register", "/dashboard"].includes(pathname)) return null;

  const initiale = utilisateur?.user_metadata?.nom_affichage?.[0]?.toUpperCase()
    || utilisateur?.email?.[0]?.toUpperCase()
    || "?";
  const nomAffiche = utilisateur?.user_metadata?.nom_affichage || utilisateur?.email;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-mirage/15 bg-gradient-to-r from-umber via-ink to-umber px-6 py-4 backdrop-blur">
      <Logo />

      {utilisateur && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOuvert((v) => !v)}
            className="flex items-center gap-3 rounded-full border border-sand-dim/25 bg-umber px-3 py-1.5 transition duration-200 hover:border-mirage"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-mirage to-violet text-xs font-medium text-ink">
              {initiale}
            </span>
            <span className="max-w-[140px] truncate text-sm text-sand">{nomAffiche}</span>
          </button>

          {menuOuvert && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-lg border border-sand-dim/25 bg-umber shadow-lg animate-[fade-up_0.15s_ease-out]">
              <div className="border-b border-sand-dim/15 px-4 py-3">
                <p className="truncate text-xs text-sand-dim">{utilisateur.email}</p>
              </div>
              <button
                onClick={handleDeconnexion}
                className="w-full px-4 py-2.5 text-left text-sm text-ember transition-colors duration-150 hover:bg-ink"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}