Oracle du Fa

Prototype full-stack prêt à héberger avec paiement Mobile Money (MTN / MOOV) et système de code d'accès automatique après paiement.

Generated on 2025-10-17.

---

Structure

Frontend : React + Vite
Backend : Node.js + Express

---

Quick start (dev)

1️⃣ Installer les dépendances

Dans le dossier principal du projet :

npm install

---

2️⃣ Créer le fichier .env

Dans :

server/

Créer un fichier :

.env

Et ajouter :

PORT=4000

---

3️⃣ Lancer le Backend

Dans un terminal :

npm run server

Le serveur démarre sur :

http://localhost:4000

---

4️⃣ Lancer le Frontend

Ouvrir un second terminal dans le même dossier puis taper :

npm run dev

Le site sera disponible sur :

http://localhost:5173

---

Système de Paiement Mobile Money

Les paiements peuvent être effectués via :

MTN MoMo : 0169941262
MOOV Money : 0158297075
WhatsApp : 0169941262

---

Tarifs de Consultation

- 1 Consultation : 1 000 F
- 3 Consultations : 2 500 F
- 7 Consultations : 5 000 F
- Accès 1 mois illimité : 10 000 F

---

Fonctionnement du Code d’Accès

Après paiement :

1. Le serveur vérifie automatiquement la transaction
2. Le système génère un code d'accès unique
3. Le client entre le code sur le site
4. L'accès à la consultation est débloqué automatiquement

Aucune validation manuelle par WhatsApp n'est requise.

---

Déploiement

Frontend :

- Vercel
- Netlify

Backend :

- Render
- Railway
- Heroku

---

Notes

- Les intégrations Mobile Money réelles nécessitent les API opérateurs
- Le prototype simule les confirmations de paiement
- Remplacer les textes Odù par le contenu fourni par votre bokonon
