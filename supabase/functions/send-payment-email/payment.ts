// supabase/functions/send-payment-email/index.ts
// Edge Function Supabase : appelée par un Database Webhook
// (déclenché automatiquement quand une ligne est insérée dans ta table "payments")
//
// Config nécessaire dans le dashboard Supabase :
// Database > Webhooks > Create a new hook
//   - Table: payments
//   - Events: INSERT
//   - Type: Supabase Edge Function
//   - Function: send-payment-email

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? 'noreply@tondomaine.com';

// Le template est chargé en dur ici car Deno Edge Functions n'a pas accès
// au filesystem de ton projet Next.js — on le stocke à côté (voir note plus bas)
import { paymentTemplate } from './template.ts';

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record; // la ligne insérée dans "payments"

  const html = paymentTemplate
    .replaceAll('{{prenom}}', record.prenom)
    .replaceAll('{{numero_commande}}', record.numero_commande)
    .replaceAll('{{date_paiement}}', new Date(record.created_at).toLocaleDateString('fr-FR'))
    .replaceAll('{{moyen_paiement}}', record.moyen_paiement)
    .replaceAll('{{montant}}', record.montant.toString())
    .replaceAll('{{devise}}', record.devise ?? 'XOF')
    .replaceAll('{{lien_recu}}', record.lien_recu ?? '#')
    .replaceAll('{{email_support}}', 'support@tondomaine.com')
    .replaceAll('{{annee}}', new Date().getFullYear().toString())
    .replaceAll('{{nom_entreprise}}', 'Ton Entreprise')
    .replaceAll('{{adresse_entreprise}}', '123 Rue Exemple, Abidjan');

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: record.email,
    subject: `Paiement confirmé — ${record.numero_commande}`,
    html,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});