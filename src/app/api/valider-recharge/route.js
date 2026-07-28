import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Client avec la clé service_role : contourne le RLS, donc à n'utiliser
// que côté serveur, jamais exposé au navigateur. La clé doit être dans
// une variable d'environnement SANS préfixe NEXT_PUBLIC_.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Secret partagé entre cette route et ton script MacroDroid / futur
// webhook CinetPay, pour éviter que n'importe qui puisse crédite
// n'importe quel compte en appelant cette URL. À définir dans
// .env.local (VALIDATION_RECHARGE_SECRET=...) ET dans MacroDroid.
const SECRET_ATTENDU = process.env.VALIDATION_RECHARGE_SECRET;

export async function POST(request) {
  const corps = await request.json().catch(() => null);

  if (!corps?.demande_id || !corps?.secret) {
    return NextResponse.json(
      { erreur: "Paramètres manquants : demande_id et secret sont requis." },
      { status: 400 }
    );
  }

  if (!SECRET_ATTENDU || corps.secret !== SECRET_ATTENDU) {
    return NextResponse.json({ erreur: "Secret invalide." }, { status: 401 });
  }

  const { error } = await supabaseAdmin.rpc("valider_recharge", {
    p_demande_id: corps.demande_id,
  });

  if (error) {
    console.error("Erreur valider_recharge :", error);
    return NextResponse.json(
      { erreur: "Impossible de valider la recharge.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ succes: true });
}