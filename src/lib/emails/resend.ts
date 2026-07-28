// lib/emails/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY manquante dans les variables d\'environnement');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// L'adresse d'envoi doit utiliser le domaine que tu as vérifié sur Resend
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@tondomaine.com';