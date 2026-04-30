import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
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

      if (data.error) {
        setError(data.error);
        return false;
      }

      // Générer un token simple (à améliorer avec JWT en production)
      const token = btoa(`${data.user.id}:${Date.now()}`);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
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

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

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
