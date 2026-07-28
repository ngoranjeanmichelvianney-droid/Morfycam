import { NextResponse } from "next/server";
import { creerClientServeur } from "@/lib/supabaseServer";
import { sendWelcomeEmail } from "@/lib/emails/send";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const suivant = searchParams.get("next") ?? "/dashboard";
  // Présent uniquement quand la connexion OAuth vient de la page
  // d'inscription avec un lien de parrainage (voir register.jsx).
  const codeParrain = searchParams.get("ref");

  if (code) {
    const supabase = await creerClientServeur();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Le trigger SQL a déjà créé la ligne profils au moment de
      // l'insertion dans auth.users, sans parrain (OAuth ne passe pas
      // par les mêmes options que signUp). On le relie ici seulement
      // si ce profil n'a pas encore de parrain, pour ne jamais écraser
      // un parrainage déjà enregistré lors d'une connexion suivante.
      if (codeParrain && data?.user) {
        const { data: parrain } = await supabase
          .from("profils")
          .select("id")
          .eq("code_parrainage", codeParrain.toUpperCase())
          .maybeSingle();

        if (parrain && parrain.id !== data.user.id) {
          await supabase
            .from("profils")
            .update({ parrain_id: parrain.id })
            .eq("id", data.user.id)
            .is("parrain_id", null);
        }
      }

      // Envoie l'email de bienvenue une seule fois : que ce soit la
      // première confirmation d'email (signup classique) ou la toute
      // première connexion OAuth. On vérifie le flag avant d'envoyer,
      // puis on le passe à true pour ne jamais renvoyer aux connexions
      // suivantes.
      if (data?.user) {
        const { data: profil } = await supabase
          .from("profils")
          .select("email_bienvenue_envoye, nom_affichage")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profil && !profil.email_bienvenue_envoye) {
          try {
            await sendWelcomeEmail({
              to: data.user.email,
              prenom: profil.nom_affichage || data.user.user_metadata?.nom_affichage || "toi",
              lienApp: `${origin}/dashboard`,
            });
          } catch (err) {
            // On ne bloque jamais la connexion si l'email échoue
            console.error("Erreur envoi email bienvenue:", err);
          }

          await supabase
            .from("profils")
            .update({ email_bienvenue_envoye: true })
            .eq("id", data.user.id);
        }
      }

      const reponse = NextResponse.redirect(`${origin}${suivant}`);
      // Empêche le navigateur de garder cette URL en cache/historique
      // rejouable — sinon un "retour arrière" réutilise le code déjà
      // consommé et déclenche une fausse déconnexion.
      reponse.headers.set("Cache-Control", "no-store, max-age=0");
      return reponse;
    }
  }

  // Si le code est absent, invalide, ou déjà utilisé → retour à la page de connexion
  const reponseErreur = NextResponse.redirect(`${origin}/login?erreur=connexion_echouee`);
  reponseErreur.headers.set("Cache-Control", "no-store, max-age=0");
  return reponseErreur;
}