// Importations des dépendances et composants
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Page de connexion/inscription
const LoginPage = () => {
  // États pour gérer le formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // État pour basculer entre connexion et inscription
  const [isLogin, setIsLogin] = useState(true);
  
  // Rôle par défaut pour les nouvelles inscriptions
  const [role, setRole] = useState('student');
  
  // Récupérer les fonctions d'authentification du contexte
  const { login, register, error, loading } = useContext(AuthContext);
  
  // Hook pour naviguer après connexion réussie
  const navigate = useNavigate();

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si c'est une connexion ou inscription
    if (isLogin) {
      // Tentative de connexion
      const success = await login(email, password);
      if (success) {
        // Rediriger vers la page d'accueil si succès
        navigate('/');
      }
    } else {
      // Tentative d'inscription
      const success = await register(email, password, role);
      if (success) {
        // Revenir au mode connexion et réinitialiser le formulaire
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          EduSchedule Pro
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Connexion' : 'Inscription'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
            }}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            {isLogin ? "Pas encore de compte? S'inscrire" : 'Déjà inscrit? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
