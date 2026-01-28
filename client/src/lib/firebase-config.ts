// Firebase configuration and email service
// Cette configuration permet d'envoyer les formulaires par email via Firebase Functions

export const firebaseConfig = {
    apiKey: "VOTRE_API_KEY", // À remplacer par votre clé Firebase
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

/**
 * Configuration de l'email de réception des formulaires
 */
export const EMAIL_CONFIG = {
    recipientEmail: "kirane@naraa.fr", // Email où vous recevrez les formulaires
    senderName: "Formulaire Naraa",
    replyTo: "contact@naraa.fr"
};

/**
 * Endpoint Firebase Function pour l'envoi d'emails
 * Après configuration de Firebase, cet endpoint sera créé automatiquement
 */
export const FIREBASE_FUNCTIONS_ENDPOINT = {
    sendQuoteRequest: "https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendQuoteRequest",
    sendContactForm: "https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactForm"
};

/**
 * Types pour les formulaires
 */
export interface QuoteFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    collaborators?: string;
    software?: string;
    message?: string;
    timestamp: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
}
