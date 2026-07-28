import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header : garde sa hauteur naturelle, ne défile jamais */}
      

      {/* Zone en dessous : se partage le reste de l'écran (100vh - hauteur du Header) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar : hauteur pleine de cette zone, défilement interne si besoin */}
        <Sidebar />

        {/* Contenu principal : seul élément qui défile normalement */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}