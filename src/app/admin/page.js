// app/admin/page.jsx
//
// Server Component : vérifie l'admin AVANT même de rendre quoi que ce
// soit, et redirige sinon.

import { redirect } from "next/navigation";
import { verifierAdmin } from "@/lib/verifierAdmin";
import AdminDemandesEnAttente from "@/components/AdminDemandesEnAttente";
import AdminCrediterClient from "@/components/AdminCrediterClient";
import AdminHistorique from "@/components/AdminHistorique";

export default async function PageAdmin() {
  const admin = await verifierAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f6f0e2] text-black">
      <div className="animate-[fade-up_0.4s_ease-out] border-b border-neutral-300 bg-[#ece2cc] px-6 py-6 md:px-12">
        <p className="font-mono text-xs uppercase tracking-widest text-mirage">Admin</p>
        <h1 className="mt-1 font-display text-3xl italic text-black md:text-4xl">
          Recharges
        </h1>
        <p className="mt-2 max-w-lg text-sm text-black">
          Vérifie la preuve de paiement reçue (WhatsApp / e-mail) avant de
          valider une demande ci-dessous.
        </p>
        <p className="mt-2 text-xs text-black/70">Connecté en tant que {admin.email}</p>
      </div>

      <div className="px-6 py-8 md:px-12">
        <AdminDemandesEnAttente />

        <details className="mt-12 rounded-xl border border-neutral-300 bg-[#f6f0e2] p-5 shadow-sm transition-all duration-300">
          <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-widest text-black/70 transition-colors hover:text-mirage">
            Crédit manuel exceptionnel (sans demande)
          </summary>
          <AdminCrediterClient />
        </details>

        <details className="mt-4 rounded-xl border border-neutral-300 bg-[#f6f0e2] p-5 shadow-sm transition-all duration-300">
          <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-widest text-black/70 transition-colors hover:text-mirage">
            Historique (validées, manuelles, expirées)
          </summary>
          <AdminHistorique />
        </details>
      </div>
    </main>
  );
}