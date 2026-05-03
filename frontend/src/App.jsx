import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import PointagePage from './pages/PointagePage';
import CahierTextePage from './pages/CahierTextePage';
import DashboardAdminPage from './pages/DashboardAdminPage';
import DashboardEnseignantPage from './pages/DashboardEnseignantPage';
import DashboardDeleguePage from './pages/DashboardDeleguePage';
import VacationPage from './pages/VacationPage';
import EmploiTempsPage from './pages/EmploiTempsPages';
import Layout from './components/Layout';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <h2>🎓 EduSchedule Pro</h2>
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/dashboard/admin" element={
            <PrivateRoute>
              <DashboardAdminPage />
            </PrivateRoute>
          } />

          <Route path="/dashboard/enseignant" element={
            <PrivateRoute>
              <DashboardEnseignantPage />
            </PrivateRoute>
          } />

          <Route path="/dashboard/delegue" element={
            <PrivateRoute>
              <DashboardDeleguePage />
            </PrivateRoute>
          } />

          <Route path="/vacations" element={
            <PrivateRoute>
              <VacationPage />
            </PrivateRoute>
          } />

          <Route path="/emploi-temps" element={
            <PrivateRoute>
              <EmploiTempsPage />
            </PrivateRoute>
          } />

          <Route path="/pointage" element={
            <PrivateRoute>
              <Layout>
                <PointagePage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/cahier" element={
            <PrivateRoute>
              <Layout>
                <CahierTextePage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}