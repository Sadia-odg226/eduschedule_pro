// Importations des dépendances et composants
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SignaturePad from '../components/SignaturePad';

// Page pour gérer les cahiers de texte (documents de cours)
const CahierTextePage = () => {
  // Récupérer l'utilisateur connecté
  const { user } = useContext(AuthContext);
  
  // États pour gérer les cahiers et le formulaire
  const [cahiers, setCahiers] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedCahier, setSelectedCahier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    id_creneau: '',
    titre_cours: '',
    contenu_json: '{}',
    statut: 'draft',
    heure_fin_reelle: '',
  });
  
  // État pour sauvegarder la signature
  const [signature, setSignature] = useState(null);

  // Charger les cahiers et créneaux au démarrage
  useEffect(() => {
    fetchCahiers();
    fetchCreneaux();
  }, []);

  // Fonction pour récupérer les cahiers depuis l'API
  const fetchCahiers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/cahiers.php');
      const data = await response.json();
      setCahiers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des cahiers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreneaux = async () => {
    try {
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/creneaux.php');
      const data = await response.json();
      setCreneaux(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des créneaux: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
    setSuccess('Signature enregistrée');
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_creneau || !formData.titre_cours) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const method = selectedCahier ? 'PUT' : 'POST';
      const body = selectedCahier
        ? { ...formData, id: selectedCahier.id }
        : formData;

      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/cahiers.php', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(selectedCahier ? 'Cahier mis à jour' : 'Cahier créé');
        setShowForm(false);
        setFormData({
          id_creneau: '',
          titre_cours: '',
          contenu_json: '{}',
          statut: 'draft',
          heure_fin_reelle: '',
        });
        setSignature(null);
        setSelectedCahier(null);
        fetchCahiers();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement: ' + err.message);
    }
  };

  const handleEdit = (cahier) => {
    setSelectedCahier(cahier);
    setFormData({
      id_creneau: cahier.id_creneau,
      titre_cours: cahier.titre_cours,
      contenu_json: cahier.contenu_json,
      statut: cahier.statut,
      heure_fin_reelle: cahier.heure_fin_reelle,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cahier?')) return;

    try {
      const response = await fetch('http://localhost/eduschedule_pro/Backend/api/cahiers.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Cahier supprimé');
        fetchCahiers();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cahier de texte</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setSelectedCahier(null);
              setFormData({
                id_creneau: '',
                titre_cours: '',
                contenu_json: '{}',
                statut: 'draft',
                heure_fin_reelle: '',
              });
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {showForm ? 'Annuler' : 'Nouveau cahier'}
          </button>
        </div>

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

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedCahier ? 'Éditer le cahier' : 'Créer un nouveau cahier'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="id_creneau" className="block text-sm font-medium text-gray-700 mb-1">
                    Créneau
                  </label>
                  <select
                    id="id_creneau"
                    name="id_creneau"
                    value={formData.id_creneau}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un créneau</option>
                    {creneaux.map((creneau) => (
                      <option key={creneau.id} value={creneau.id}>
                        {creneau.jour} - {creneau.heure_debut} à {creneau.heure_fin} ({creneau.matiere})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="titre_cours" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du cours
                  </label>
                  <input
                    id="titre_cours"
                    type="text"
                    name="titre_cours"
                    value={formData.titre_cours}
                    onChange={handleInputChange}
                    placeholder="Ex: Cours de mathématiques"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contenu_json" className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu du cours
                </label>
                <textarea
                  id="contenu_json"
                  name="contenu_json"
                  value={formData.contenu_json}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="heure_fin_reelle" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin réelle
                  </label>
                  <input
                    id="heure_fin_reelle"
                    type="time"
                    name="heure_fin_reelle"
                    value={formData.heure_fin_reelle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="submitted">Soumis</option>
                    <option value="approved">Approuvé</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Signature</h3>
                <SignaturePad onSignatureSave={handleSignatureSave} />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {selectedCahier ? 'Mettre à jour' : 'Créer'} le cahier
              </button>
            </form>
          </div>
        )}

        {/* Liste des cahiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cahiers.length === 0 ? (
            <p className="text-gray-600 col-span-full">Aucun cahier disponible</p>
          ) : (
            cahiers.map((cahier) => (
              <div key={cahier.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{cahier.titre_cours}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Matière:</strong> {cahier.matiere}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Créneau:</strong> {cahier.jour} - {cahier.heure_debut}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Statut:</strong>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cahier.statut === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : cahier.statut === 'submitted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cahier.statut}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cahier)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(cahier.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CahierTextePage;
