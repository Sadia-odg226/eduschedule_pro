// Importations nécessaires
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Composant qui protège les routes en exigeant une authentification
const PrivateRoute = ({ children }) => {
  // Récupérer l'état d'authentification depuis le contexte
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Pendant le chargement, afficher un message
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  // Si connecté, afficher la page, sinon rediriger vers login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
