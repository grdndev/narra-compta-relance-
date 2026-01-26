# Déploiement sur Hostinger

Ce projet est une application Fullstack (Node.js + React/Vite). Pour le déployer sur Hostinger, vous avez deux options principales : **Hébergement VPS** (recommandé pour plus de contrôle) ou **Hébergement Partagé/Cloud** (via la fonctionnalité Node.js).

J'ai déjà préparé le projet pour le déploiement :
1.  **Correction des erreurs** : Les erreurs TypeScript bloquantes ont été corrigées.
2.  **Favicon** : L'image "ChatGPT Image 26 janv. 2026, 11_16_07.png" a été intégrée comme favicon.
3.  **Build** : Le projet compile correctement.

---

## Option 1 : Hébergement Web / Cloud (avec Node.js)

Cette méthode utilise le panneau hPanel de Hostinger.

### Étape 1 : Préparer les fichiers
Sur votre ordinateur, assurez-vous d'avoir fait le build (je l'ai déjà fait pour vous, le dossier `dist` est prêt).
Si vous devez le refaire :
```bash
npm install
npm run build
```

Vous devez uploader les fichiers suivants sur Hostinger (par FTP ou le Gestionnaire de Fichiers) :
*   Le dossier `dist` (qui contient le serveur et le client compilés).
*   Le fichier `package.json`.
*   Le fichier `package-lock.json`.

**Note** : Vous n'avez PAS besoin d'uploader le dossier `node_modules` ni le dossier `client` source.

### Étape 2 : Configuration sur Hostinger (hPanel)
1.  Connectez-vous à votre compte Hostinger.
2.  Allez dans **Sites Web** > **Gérer**.
3.  Cherchez la section **Avancé** et cliquez sur **Node.js**.
4.  Cliquez sur **Créer une application**.
    *   **Version Node.js** : Choisissez la version recommandée (18 ou 20).
    *   **Mode d'application** : Production.
    *   **Racine de l'application** : Le dossier où vous avez uploadé vos fichiers (ex: `public_html` ou `public_html/app`).
    *   **Fichier de démarrage de l'application** : `dist/index.cjs`.
5.  Cliquez sur **Créer**.

### Étape 3 : Installation des dépendances
1.  Une fois l'application créée, cliquez sur le bouton **NPM Install** qui apparaît dans l'interface Hostinger. Cela va installer les modules nécessaires (spécifiés dans package.json) sur le serveur.
2.  Attendez que l'installation soit terminée.

### Étape 4 : Lancer
1.  Cliquez sur **Démarrer l'application** (ou Redémarrer).
2.  Accédez à votre URL pour voir votre site.

---

## Option 2 : Hébergement VPS

Si vous avez un VPS, connectez-vous via SSH.

1.  **Mettez à jour le système** :
    ```bash
    sudo apt update && sudo apt upgrade
    ```
2.  **Installez Node.js** (v20 recommandé).
3.  **Transférez vos fichiers** (utilisez `scp` ou FileZilla) :
    Copiez tout le dossier du projet (sauf `node_modules`).
4.  **Installation et Build sur le serveur** :
    ```bash
    cd /chemin/vers/votre/projet
    npm install
    npm run build
    ```
5.  **Lancer avec PM2** (pour garder l'app active):
    ```bash
    npm install -g pm2
    pm2 start dist/index.cjs --name "compta-relance"
    pm2 save
    pm2 startup
    ```
6.  Configurez Nginx comme Reverse Proxy pour rediriger le port 80 vers le port 5000 (port par défaut de l'app).

---

## Vérifications
*   Le serveur écoute par défaut sur le port `5000`. Sur l'hébergement partagé Hostinger, la variable `PORT` est automatiquement définie par leur infrastructure, et l'application s'adaptera automatiquement (testé dans le code `process.env.PORT`).
*   Le **Favicon** est accessible.
*   L'application utilise actuellement des **données de test (Mock Data)** stockées en mémoire. Aucune base de données PostgreSQL n'est requise pour l'instant.

Pour toute modification future, modifiez le code localement, refaites `npm run build`, et re-uploadez le dossier `dist`.
