CREATE DATABASE eduschedule_db;
USE eduschedule_db;
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    libelle VARCHAR(100),
    niveau VARCHAR(50),
    annee_academique VARCHAR(20)
);
