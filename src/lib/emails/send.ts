// lib/emails/send.ts
import fs from 'fs';
import path from 'path';
import { resend, EMAIL_FROM } from './resend';

// Charge un template HTML et remplace les variables {{cle}} par leur valeur
function renderTemplate(templateName: string, vars: Record<string, string>): string {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'emails', 'templates', templateName);
  let html = fs.readFileSync(filePath, 'utf8');

  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

// NOTE : les emails "Vérification" et "Reset password" sont gérés nativement
// par Supabase Auth (dashboard > Authentication > Email Templates), PAS ici.
// Ce fichier ne gère que les emails déclenchés manuellement par ton code :
// bienvenue (après inscription confirmée) et confirmation de paiement.

// ---------- 1. Email de bienvenue ----------
export async function sendWelcomeEmail(params: {
  to: string;
  prenom: string;
  lienApp: string;
}) {
  const html = renderTemplate('email-bienvenue.html', {
    PRENOM: params.prenom,
    LIEN_APP: params.lienApp,
  });

  return resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: 'Bienvenue sur MorfyCam 👋',
    html,
  });
}

// ---------- 2. Email de confirmation de paiement ----------
export async function sendPaymentConfirmationEmail(params: {
  to: string;
  prenom: string;
  nomOffre: string;
  montant: string;
  reference: string;
  date: string;
  lienApp: string;
}) {
  const html = renderTemplate('email-paiement-confirme.html', {
    PRENOM: params.prenom,
    NOM_OFFRE: params.nomOffre,
    MONTANT: params.montant,
    REFERENCE: params.reference,
    DATE: params.date,
    LIEN_APP: params.lienApp,
  });

  return resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: `Paiement confirmé — ${params.reference}`,
    html,
  });
}