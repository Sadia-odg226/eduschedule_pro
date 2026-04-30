// Importation des hooks React nécessaires
import React, { createContext, useState, useCallback, useEffect } from 'react';

// Créer un contexte pour partager les données d'authentification dans l'app
export const AuthContext = createContext();

// Composant Provider qui gère l'état d'authentification
export const AuthProvider = ({ children }) => {
  // États pour gérer l'utilisateur, le chargement et les erreurs
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook pour charger l'utilisateur stocké au démarrage
  useEffect(() => {
    // Récupérer les données stockées dans le navigateur
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Si l'utilisateur et le token existent, restaurer la session
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    // Arrêter le chargement après vérification
    setLoading(false);
  }, []);

  // Fonction pour se connecter avec email et mot de passe
  // Fonction pour se connecter avec email et mot de passe
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Faire une requête au serveur pour vérifier les identifiants
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const data = await response.json();

      // Vérifier s'il y a une erreur du serveur
      if (data.error) {
        setError(data.error);
        return false;
      }

      // Générer un token simple (à améliorer avec JWT en production)
      // TODO: Utiliser JWT à la place pour plus de sécurité
      const token = btoa(`${data.user.id}:${Date.now()}`);
      
      // Sauvegarder l'utilisateur et le token dans le navigateur
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', token);
      
      // Mettre à jour l'état de l'app
      setUser(data.user);
      return true;
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour créer un nouveau compte
  const register = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Envoyer les données d'inscription au serveur
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      // Gérer les erreurs
      if (data.error) {
        setError(data.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erreur lors de l\'inscription: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour se déconnecter
  const logout = useCallback(() => {
    // Supprimer les données de session
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Réinitialiser l'utilisateur
    setUser(null);
  }, []);

  // Objet contenant toutes les fonctions et états à partager
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
