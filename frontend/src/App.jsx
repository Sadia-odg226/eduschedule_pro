// Importations des dépendances React Router et composants
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importations des pages
import LoginPage from './pages/LoginPage';
import PointagePage from './pages/PointagePage';
import CahierTextePage from './pages/CahierTextePage';
import Layout from './components/Layout';

// Composant principal de l'application
export default function App() {
  return (
    // Provider d'authentification pour toute l'app
    <AuthProvider>
      {/* Router pour gérer la navigation entre les pages */}
      <Router>
        <Routes>
          {/* Page de connexion (publique) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Pages protégées par authentification */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      🎓 EduSchedule Pro
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      Bienvenue dans le système de gestion d'emplois du temps
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <a
                        href="/pointage"
                        className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition"
                      >
                        📱 Pointage
                      </a>
                      <a
                        href="/cahier"
                        className="block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition"
                      >
                        📝 Cahier de texte
                      </a>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Page de pointage (protégée) */}
          <Route
            path="/pointage"
            element={
              <PrivateRoute>
                <Layout>
                  <PointagePage />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Page du cahier de texte (protégée) */}
          <Route
            path="/cahier"
            element={
              <PrivateRoute>
                <Layout>
                  <CahierTextePage />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Redirection par défaut vers l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}