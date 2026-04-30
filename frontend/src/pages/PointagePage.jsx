import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import QRScanner from '../components/QRScanner';

const PointagePage = () => {
  const { user } = useContext(AuthContext);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchCreneaux();
  }, []);

  const fetchCreneaux = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/creneaux.php');
      const data = await response.json();
      setCreneaux(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des créneaux: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointages = async (creneauId) => {
    try {
      const response = await fetch(`http://localhost/eduschedule_pro/Backend/api/pointages.php?id_creneau=${creneauId}`);
      const data = await response.json();
      setPointages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des pointages: ' + err.message);
    }
  };

  const handleSelectCreneau = (creneau) => {
    setSelectedCreneau(creneau);
    fetchPointages(creneau.id);
    setScanning(true);
  };

  const handleQRScan = async (token) => {
    if (!selectedCreneau) {
      setError('Aucun créneau sélectionné');
      return;
    }

    try {
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/pointages.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_creneau: selectedCreneau.id,
          token_utilise: token,
          statut: 'present',
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Pointage enregistré avec succès!');
        fetchPointages(selectedCreneau.id);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pointage</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liste des créneaux */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Créneaux</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {creneaux.length === 0 ? (
                <p className="text-gray-600">Aucun créneau disponible</p>
              ) : (
                creneaux.map((creneau) => (
                  <button
                    key={creneau.id}
                    onClick={() => handleSelectCreneau(creneau)}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedCreneau?.id === creneau.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">
                      {creneau.jour} - {creneau.heure_debut} à {creneau.heure_fin}
                    </div>
                    <div className="text-sm opacity-75">{creneau.matiere}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* QR Scanner */}
          {selectedCreneau && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Scan QR Code</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Créneau sélectionné: <strong>{selectedCreneau.matiere}</strong>
                </p>
                <button
                  onClick={() => setSelectedCreneau(null)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Changer de créneau
                </button>
              </div>
              <QRScanner onScan={handleQRScan} disabled={!scanning} />
            </div>
          )}
        </div>

        {/* Historique des pointages */}
        {selectedCreneau && pointages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pointages enregistrés</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Heure</th>
                    <th className="text-left py-2 px-4">Statut</th>
                    <th className="text-left py-2 px-4">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {pointages.map((pointage) => (
                    <tr key={pointage.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{pointage.heure_pointage_reelle}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          pointage.statut === 'present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pointage.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">{pointage.ip_source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointagePage;
