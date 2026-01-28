# Configuration Firebase pour l'envoi d'emails

Ce guide détaille comment configurer Firebase pour recevoir les formulaires par email.

## Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. Nommez-le "Naraa" et suivez les étapes
4. Une fois créé, notez vos identifiants de configuration

## Étape 2 : Récupérer la configuration

1. Dans Firebase Console, allez dans **Paramètres du projet** (⚙️)
2. Sous "Vos applications", cliquez sur "</>" (Web)
3. Copiez les clés de configuration

## Étape 3 : Mettre à jour la configuration locale

Ouvrez `client/src/lib/firebase-config.ts` et remplacez :

```typescript
export const firebaseConfig = {
  apiKey: "VOTRE_API_KEY_ICI",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};
```

## Étape 4 : Créer la Cloud Function pour l'envoi d'emails

### Installation

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Code de la fonction (à placer dans `functions/index.js`)

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configuration du transporteur email (Gmail comme exemple)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre-email@gmail.com',  // Votre email  
    pass: 'votre-app-password'      // Mot de passe d'application Gmail
  }
});

exports.sendQuoteRequest = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const { to, subject, formData } = req.body;

  const htmlContent = \`
    <h2>Nouvelle demande de devis - ${formData.company}</h2>
    <p><strong>Nom :</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Email :</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
    <p><strong>Téléphone :</strong> ${formData.phone}</p>
    <p><strong>Cabinet :</strong> ${formData.company}</p>
    ${formData.collaborators ? \`<p><strong>Collaborateurs :</strong> ${formData.collaborators}</p>\` : ''}
    ${formData.software ? \`<p><strong>Logiciel :</strong> ${formData.software}</p>\` : ''}
    ${formData.message ? \`<p><strong>Message :</strong><br>${formData.message}</p>\` : ''}
    <p><strong>Date :</strong> ${new Date(formData.timestamp).toLocaleString('fr-FR')}</p>
  \`;

  const mailOptions = {
    from: 'Formulaire Naraa <noreply@naraa.fr>',
    to: to || 'kirane@naraa.fr',
    replyTo: formData.email,
    subject: subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Déploiement de la fonction

```bash
cd functions
npm install nodemailer
cd ..
firebase deploy --only functions
```

## Étape 5 : Mettre à jour l'URL de la fonction

Une fois déployée, Firebase vous donnera une URL. Copiez-la et mettez à jour `client/src/lib/firebase-config.ts` :

```typescript
export const FIREBASE_FUNCTIONS_ENDPOINT = {
  sendQuoteRequest: "https://VOTRE-REGION-VOTRE-PROJET.cloudfunctions.net/sendQuoteRequest",
  // ...
};
```

## Étape 6 : Activer la fonction côté client

Dans `client/src/lib/email-service.ts`, décommentez la section marquée `TODO` :

```typescript
// Remplacer la simulation par l'appel réel
const response = await fetch(FIREBASE_FUNCTIONS_ENDPOINT.sendQuoteRequest, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: EMAIL_CONFIG.recipientEmail,
    subject: \`Nouvelle demande de devis - ${formData.company}\`,
    formData: formData,
  }),
});
```

## Configuration alternative : SendGrid

Si vous préférez SendGrid (plus robuste pour l'envoi d'emails) :

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('VOTRE_SENDGRID_API_KEY');

exports.sendQuoteRequest = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const { to, subject, formData } = req.body;
  
  const msg = {
    to: to || 'kirane@naraa.fr',
    from: 'contact@naraa.fr', // Doit être vérifié dans SendGrid
    replyTo: formData.email,
    subject: subject,
    html: /* votre HTML */
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Test de l'intégration

1. Remplissez le formulaire de devis sur `naraa.fr/site-vitrine/quote`
2. Vérifiez la console du navigateur
3. Vérifiez votre boîte email `kirane@naraa.fr`

---

**Actuellement**, le système fonctionne en **mode simulation**. Les formulaires s'affichent correctement mais les emails ne sont pas envoyés tant que Firebase n'est pas configuré.
