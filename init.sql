CREATE DATABASE eduschedule_db;
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
);