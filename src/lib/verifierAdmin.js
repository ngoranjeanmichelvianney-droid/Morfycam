// lib/verifierAdmin.js
//
// Vérifie que la requête serveur vient d'un utilisateur authentifié
// (via le cookie de session Supabase, géré par le middleware) ET dont
// l'e-mail figure dans la liste ADMIN_EMAILS (.env.local).
//
// Utilisable dans un Server Component (page admin) ou une route API,
// puisque les deux ont accès aux cookies de la requête.

import { creerClientServeur } from "@/lib/supabaseServer";

/**
 * @returns {Promise<{ id: string, email: string } | null>}
 *          l'utilisateur admin si autorisé, sinon null
 */
export async function verifierAdmin() {
  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const emailsAutorises = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!emailsAutorises.includes(user.email.toLowerCase())) {
    return null;
  }

  return { id: user.id, email: user.email };
}