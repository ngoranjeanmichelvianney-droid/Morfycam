"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Logo from "@/components/Logo";

export default function DashboardShell({ children }) {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      {/* Barre mobile uniquement — hamburger + logo, cachée sur desktop */}
      <div className="flex items-center justify-between border-b border-sand-dim/15 bg-umber px-4 py-3 lg:hidden">
        <Logo taille={28} />
        <button
          onClick={() => setMenuOuvert(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand-dim/20 text-sand transition-colors hover:border-mirage"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Fond sombre cliquable, visible seulement quand le menu mobile est ouvert */}
        {menuOuvert && (
          <div
            onClick={() => setMenuOuvert(false)}
            className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
          />
        )}

        <Sidebar estOuvert={menuOuvert} onFermer={() => setMenuOuvert(false)} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}