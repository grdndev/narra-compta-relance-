/**
 * Service d'envoi d'emails via Firebase Functions
 * 
 * Ce service envoie les formulaires de demande de devis et de contact
 * directement à votre email via Firebase Cloud Functions.
 */

import type { QuoteFormData, ContactFormData } from './firebase-config';
import { FIREBASE_FUNCTIONS_ENDPOINT, EMAIL_CONFIG } from './firebase-config';

// Re-export types for convenience
export type { QuoteFormData, ContactFormData };

/**
 * Envoie une demande de devis par email
 */
export async function sendQuoteRequest(formData: QuoteFormData): Promise<{ success: boolean; message: string }> {
    try {
        // Pour l'instant, simulation de l'envoi (à remplacer par l'appel Firebase réel)
        console.log('📧 Demande de devis à envoyer:', formData);
        console.log('📬 Destination:', EMAIL_CONFIG.recipientEmail);

        // TODO: Décommenter cette section une fois Firebase configuré
        /*
        const response = await fetch(FIREBASE_FUNCTIONS_ENDPOINT.sendQuoteRequest, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: EMAIL_CONFIG.recipientEmail,
            subject: `Nouvelle demande de devis - ${formData.company}`,
            formData: formData,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    
        const result = await response.json();
        return { success: true, message: 'Demande envoyée avec succès' };
        */

        // Simulation réussie (pour les tests)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Demande envoyée avec succès' });
            }, 1000);
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        return {
            success: false,
            message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
        };
    }
}

/**
 * Envoie un message de contact par email
 */
export async function sendContactMessage(formData: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
        console.log('📧 Message de contact à envoyer:', formData);
        console.log('📬 Destination:', EMAIL_CONFIG.recipientEmail);

        // TODO: Décommenter cette section une fois Firebase configuré
        /*
        const response = await fetch(FIREBASE_FUNCTIONS_ENDPOINT.sendContactForm, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: EMAIL_CONFIG.recipientEmail,
            subject: `Nouveau message de contact - ${formData.subject}`,
            formData: formData,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    
        const result = await response.json();
        return { success: true, message: 'Message envoyé avec succès' };
        */

        // Simulation réussie (pour les tests)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Message envoyé avec succès' });
            }, 1000);
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        return {
            success: false,
            message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
        };
    }
}

/**
 * Formate les données du formulaire en HTML pour l'email
 */
export function formatQuoteEmailHTML(data: QuoteFormData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { background: #f8fafc; padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #64748b; }
        .value { color: #0f172a; font-size: 16px; }
        .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Nouvelle Demande de Devis</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nom complet</div>
            <div class="value">${data.firstName} ${data.lastName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Téléphone</div>
            <div class="value">${data.phone}</div>
          </div>
          <div class="field">
            <div class="label">Cabinet</div>
            <div class="value">${data.company}</div>
          </div>
          ${data.collaborators ? `
          <div class="field">
            <div class="label">Nombre de collaborateurs</div>
            <div class="value">${data.collaborators}</div>
          </div>
          ` : ''}
          ${data.software ? `
          <div class="field">
            <div class="label">Logiciel de production</div>
            <div class="value">${data.software}</div>
          </div>
          ` : ''}
          ${data.message ? `
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${data.message}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Date de la demande</div>
            <div class="value">${new Date(data.timestamp).toLocaleString('fr-FR')}</div>
          </div>
        </div>
        <div class="footer">
          <p>Email envoyé automatiquement depuis naraa.fr</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
