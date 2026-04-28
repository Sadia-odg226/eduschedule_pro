/*CREATE DATABASE eduschedule_db;
USE eduschedule_db;
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    libelle VARCHAR(100),
    annee_academique VARCHAR(20)
);
CREATE TABLE matieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    libelle VARCHAR(100),
    volume_horaire_total INT,
    coefficient INT
);

CREATE TABLE enseignants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100),
    specialite VARCHAR(100),
    statut VARCHAR(50),
    taux_horaire DECIMAL(10,2)
);

CREATE TABLE salles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    capacite INT,
    equipements TEXT,
    batiment VARCHAR(100)
);

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    mot_de_passe_hash VARCHAR(255),
    role VARCHAR(50),
    id_lien INT,
    actif BOOLEAN DEFAULT TRUE,
    token_reset VARCHAR(255)
);

CREATE TABLE emploi_temps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_classe INT,
    semaine_debut DATE,
    statut_publication BOOLEAN,
    cree_par INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_classe) REFERENCES classes(id)
);

CREATE TABLE creneaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_emploi_temps INT,
    id_matiere INT,
    id_enseignant INT,
    id_salle INT,
    jour VARCHAR(20),
    heure_debut TIME,
    heure_fin TIME,
    qr_token TEXT,
    qr_expire DATETIME,
    FOREIGN KEY (id_emploi_temps) REFERENCES emploi_temps(id),
    FOREIGN KEY (id_matiere) REFERENCES matieres(id),
    FOREIGN KEY (id_enseignant) REFERENCES enseignants(id),
    FOREIGN KEY (id_salle) REFERENCES salles(id)
);

CREATE TABLE pointages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_creneau INT,
    heure_pointage_reelle DATETIME,
    ip_source VARCHAR(50),
    token_utilise TEXT,
    statut VARCHAR(50),
    FOREIGN KEY (id_creneau) REFERENCES creneaux(id)
);

CREATE TABLE cahiers_texte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_creneau INT,
    id_delegue INT,
    titre_cours VARCHAR(255),
    contenu_json TEXT,
    heure_fin_reelle TIME,
    statut VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creneau) REFERENCES creneaux(id)
);

CREATE TABLE signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cahier INT,
    type_signataire VARCHAR(50),
    id_utilisateur INT,
    signature_base64 LONGTEXT,
    horodatage DATETIME,
    FOREIGN KEY (id_cahier) REFERENCES cahiers_texte(id)
);

CREATE TABLE travaux_demandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cahier INT,
    description TEXT,
    date_limite DATE,
    type VARCHAR(50),
    FOREIGN KEY (id_cahier) REFERENCES cahiers_texte(id)
);

CREATE TABLE vacations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_enseignant INT,
    mois INT,
    annee INT,
    montant_brut DECIMAL(10,2),
    montant_net DECIMAL(10,2),
    statut VARCHAR(50),
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_enseignant) REFERENCES enseignants(id)
);

CREATE TABLE vacation_lignes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_vacation INT,
    id_creneau INT,
    duree_heures DECIMAL(5,2),
    taux DECIMAL(10,2),
    montant DECIMAL(10,2),
    FOREIGN KEY (id_vacation) REFERENCES vacations(id),
    FOREIGN KEY (id_creneau) REFERENCES creneaux(id)
);

CREATE TABLE validations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_vacation INT,
    id_validateur INT,
    role_validateur VARCHAR(50),
    visa_base64 LONGTEXT,
    date_validation DATETIME,
    commentaire TEXT,
    FOREIGN KEY (id_vacation) REFERENCES vacations(id)
);

CREATE TABLE logs_activite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    action VARCHAR(255),
    details_json TEXT,
    ip VARCHAR(50),
    date_heure TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/

-- INTSER: ajout des données


INSERT INTO classes (code, libelle, niveau) VALUES
('L1', 'Licence 1 RIT', 'L1'),
('L2', 'Licence 2 RIT', 'L2'),
('L3', 'Licence 3 RIT', 'L3');


INSERT INTO matieres (code, libelle) VALUES
('RES', 'Réseaux'),
('BD', 'Base de données'),
('WEB', 'Développement Web');


INSERT INTO users (nom, prenom, email, mot_de_passe, role, taux_horaire, id_classe) VALUES
('Admin', 'System', 'admin@eduschedule.com', MD5('admin123'), 'admin', NULL, NULL),
('Traore', 'Ali', 'ali@mail.com', MD5('password123'), 'enseignant', 5000, NULL),
('Ouédraogo', 'Mariam', 'mariam@mail.com', MD5('password123'), 'enseignant', 6000, NULL),
('Zongo', 'Paul', 'paul@mail.com', MD5('password123'), 'enseignant', 5500, NULL),
('Kaboré', 'Jean', 'jean@mail.com', MD5('password123'), 'enseignant', 5000, NULL),
('Sawadogo', 'Awa', 'awa@mail.com', MD5('password123'), 'enseignant', 6500, NULL),
('Compaoré', 'Issa', 'delegue.l1@mail.com', MD5('delegue123'), 'delegue', NULL, 1),
('Ouedraogo', 'Fatou', 'delegue.l2@mail.com', MD5('delegue123'), 'delegue', NULL, 2),
('Traore', 'Moussa', 'delegue.l3@mail.com', MD5('delegue123'), 'delegue', NULL, 3);


INSERT INTO salles (code, capacite) VALUES
('A1', 30),
('B1', 40),
('C1', 50);


INSERT INTO emploi_temps (id_classe, semaine_debut) VALUES
(1, '2025-01-06'),
(2, '2025-01-06'),
(3, '2025-01-06');


INSERT INTO creneaux (id_emploi, id_matiere, id_enseignant, id_salle, jour, heure_debut, heure_fin) VALUES
-- L1 
(1, 1, 2, 1, 'Lundi', '08:00:00', '10:00:00'),
(1, 2, 3, 2, 'Mardi', '10:00:00', '12:00:00'),
(1, 3, 4, 3, 'Mercredi', '14:00:00', '16:00:00'),
-- L2
(2, 2, 3, 2, 'Lundi', '14:00:00', '16:00:00'),
(2, 1, 6, 1, 'Mardi', '08:00:00', '10:00:00'),
(2, 3, 4, 3, 'Mercredi', '10:00:00', '12:00:00'),
-- L3
(3, 3, 5, 3, 'Lundi', '08:00:00', '10:00:00'),
(3, 1, 6, 1, 'Mardi', '14:00:00', '16:00:00'),
(3, 2, 3, 2, 'Mercredi', '08:00:00', '10:00:00');
