// lib/supabase-admin.js
//
// Client Supabase avec la clé de service (SUPABASE_SECRET_KEY).
// Contourne le RLS — à n'utiliser QUE dans du code serveur
// (routes API, jamais dans un composant "use client").
//
// Ne jamais importer ce fichier depuis un composant client : la clé
// de service ne doit jamais atteindre le bundle JS du navigateur.

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);