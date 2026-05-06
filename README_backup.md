# EduSchedule Pro

Système Intégré de Gestion de l'Emploi du Temps et de Suivi Pédagogique

## Technologies utilisées

- **Frontend** : React 18, Bootstrap 5, Vite
- **Backend** : PHP 8, MySQL
- **Serveur local** : WAMP

## Prérequis

- WAMP Server installé et lancé
- Node.js v20+ installé
- Navigateur web moderne

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Sadia-odg226/eduschedule_pro.git
cd eduschedule_pro
```

### 2. Configurer la base de données
- Lancer WAMP (icône verte)
- Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
- Créer une base : `eduschedule_db`
- Importer le fichier : `init.sql`

### 3. Configurer le Backend
- Copier le dossier `Backend/` dans `C:\wamp64\www\`

### 4. Installer et lancer le Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Accéder à l'application
```
http://localhost:5173
```

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@eduschedule.com | password |
| Enseignant | ali@mail.com | password |
| Délégué | delegue.l1@mail.com | password |

## Modules

1. **Emploi du temps** — Gestion des plannings hebdomadaires
2. **Pointage QR-Code** — Validation de présence des enseignants
3. **Cahier de texte** — Suivi pédagogique des séances
4. **Vacation** — Calcul automatique des fiches de paiement
5. **Tableau de bord** — Statistiques et alertes

## Structure du projet

```
EduSchedulePro/
├── Backend/          → API PHP
│   ├── api/          → Endpoints REST
│   ├── config/       → Connexion base de données
│   ├── middleware/   → Authentification JWT
│   └── utils/        → QR-Code
├── frontend/         → Application React
│   └── src/
│       ├── components/  → Navbar, Sidebar, Layout
│       ├── pages/       → Pages de l'application
│       ├── context/     → AuthContext
│       └── services/    → Appels API
└── init.sql          → Script base de données
```

## Groupe — Année 2025-2026

- **Membre 1** — Base de données + Emploi du temps
- **Membre 2** — Authentification + QR-Code + Cahier de texte
- **Membre 3** — Vacation + Tableaux de bord + Intégration
