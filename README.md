# Firebase Authentication Web App

Application web moderne d'authentification multi-pages basée sur **Vite**, **Tailwind CSS v4**, et **Firebase v11** (Auth & Firestore).

---

## 🚀 Fonctionnalités

- **Inscription (Sign Up)** : Création de compte sécurisée avec Firebase Auth, mise à jour du profil (`displayName`) et stockage des informations utilisateur dans Cloud Firestore (`users/{uid}`).
- **Connexion (Sign In)** : Authentification par email/mot de passe avec gestion détaillée des messages d'erreur et redirection automatique vers l'espace connecté.
- **Récupération de mot de passe** : Envoi direct d'un e-mail de réinitialisation sécurisé via Firebase Auth.
- **Contrôle d'accès & Session** :
  - Garde de navigation sur `home.html` redirigeant vers `index.html` si non authentifié.
  - Détection automatique de session sur `index.html` pour rediriger les utilisateurs déjà connectés.
  - Déconnexion propre (`signOut`) avec réinitialisation de l'état local.
- **Accessibilité & Ergonomie** :
  - Affichage / masquage du mot de passe avec synchronisation visuelle de l'icône et des attributs ARIA (`aria-pressed`, `aria-label`).
  - Alertes dynamiques non intrusives (`aria-live="polite"`).
  - Prise en charge native de la soumission de formulaire au clavier via la touche `Entrée`.
  - Design responsive fluide avec Tailwind CSS v4 (`clamp()`, backdrop-blur, gradients).

---

## 📂 Structure du Projet

```text
Auth-app/
├── 404.html                # Page d'erreur 404 stylisée et compilée par Vite
├── home.html               # Page d'accueil de l'espace membre
├── index.html              # Page principale de connexion / inscription
├── src/
│   ├── auth.js             # Contrôleur d'authentification et point d'entrée d'index.html
│   ├── firebaseConfig.js   # Initialisation du SDK Firebase et Analytics sécurisé
│   ├── home.js             # Contrôleur de l'espace membre et point d'entrée de home.html
│   ├── ui.js               # Basculement d'interface et visibilité des mots de passe
│   └── style.css           # Feuille de style Tailwind CSS avec tokens réutilisables
├── .env.example            # Modèle des variables d'environnement requises
├── .firebaserc             # Association du projet Firebase CLI
├── firebase.json           # Configuration du déploiement Firebase Hosting (cleanUrls: true)
├── package.json            # Dépendances et scripts npm
├── vite.config.js          # Configuration du bundler Vite multi-pages (index, home, 404)
└── README.md               # Documentation du projet
```

---

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure.
- Un projet [Firebase](https://console.firebase.google.com/) avec :
  - **Firebase Authentication** activé (fournisseur *Adresse e-mail / Mot de passe* activé).
  - **Cloud Firestore** activé en mode production.

---

## ⚙️ Installation & Configuration

1. **Cloner le dépôt et installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement** :
   Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
   Renseignez ensuite vos identifiants Firebase obtenus dans la console de votre projet :
   ```env
   VITE_FIREBASE_API_KEY=votre_cle_api
   VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=votre-projet
   VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
   VITE_FIREBASE_APP_ID=votre_app_id
   VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id
   ```

---

## 💻 Commandes Disponibles

| Commande | Action |
|---|---|
| `npm run dev` | Lance le serveur de développement local Vite (avec rechargement à chaud). |
| `npm run build` | Compile et minifie l'application de production dans le dossier `dist/`. |
| `npm run preview` | Lance un serveur local pour prévisualiser le build de production généré. |

---

## 🚀 Déploiement sur Firebase Hosting

1. Connectez-vous à la CLI Firebase si ce n'est pas déjà fait :
   ```bash
   npx firebase login
   ```
2. Compilez le projet pour la production :
   ```bash
   npm run build
   ```
3. Déployez sur Firebase Hosting :
   ```bash
   npx firebase deploy --only hosting
   ```

---

## 🔒 Sécurité & Firestore Rules

Par défaut, les utilisateurs enregistrent leur profil dans la collection `users/{userId}`. Assurez-vous d'avoir configuré vos règles de sécurité Firestore afin que seul l'utilisateur propriétaire puisse écrire et lire ses données :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
