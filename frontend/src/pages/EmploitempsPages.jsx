import { useState, useEffect } from "react"
import { getEmploiTemps, getClasses } from "../services/api"
import Layout from "../components/Layout"

const BASE_URL = "http://localhost/Backend/api"

export default function EmploiTempsPage() {
  const [creneaux, setCreneaux] = useState([])
  const [classes, setClasses] = useState([])
  const [enseignants, setEnseignants] = useState([])
  const [salles, setSalles] = useState([])
  const [classeSelectionnee, setClasseSelectionnee] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    jour: "Lundi",
    heure_debut: "",
    heure_fin: "",
    matiere_texte: "",
    id_enseignant: "",
    id_salle: ""
  })

  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

  useEffect(() => {
    getClasses().then(data => {
      if (data.success) setClasses(data.data)
    })
    fetch(`${BASE_URL}/enseignants.php`)
      .then(r => r.json())
      .then(data => { if (data.success) setEnseignants(data.data) })
    fetch(`${BASE_URL}/salles.php`)
      .then(r => r.json())
      .then(data => { if (data.success) setSalles(data.data) })
  }, [])

 const chargerCreneaux = async () => {
  if (classeSelectionnee) {
    const response = await fetch(`http://localhost/Backend/api/emploi_temps.php?id_classe=${classeSelectionnee}`)
    const data = await response.json()
    console.log("Données complètes:", JSON.stringify(data))
    if (data.success) setCreneaux(data.data)
  }
}

useEffect(() => {
  chargerCreneaux()
}, [classeSelectionnee])
  const ajouterCreneau = async () => {
    if (!classeSelectionnee) {
      alert("Choisissez une classe d'abord !")
      return
    }

    // Récupérer l'id_emploi_temps de la classe
    const etResponse = await fetch(`${BASE_URL}/emploi_temps.php?id_classe=${classeSelectionnee}`)
    const etData = await etResponse.json()

    let id_emploi_temps = null
    if (etData.success && etData.data.length > 0) {
      id_emploi_temps = etData.data[0].id_emploi_temps
    } else {
      // Créer un emploi du temps pour cette classe
      const createET = await fetch(`${BASE_URL}/emploi_temps.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_classe: classeSelectionnee })
      })
      const createData = await createET.json()
      id_emploi_temps = createData.id
    }

    const response = await fetch(`${BASE_URL}/creneaux.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id_emploi_temps })
    })
    const data = await response.json()
    if (data.success) {
  alert("Créneau ajouté !")
  setShowForm(false)
  // Recharger les créneaux
  const refresh = await fetch(`${BASE_URL}/emploi_temps.php?id_classe=${classeSelectionnee}`)
  const refreshData = await refresh.json()
  if (refreshData.success) setCreneaux(refreshData.data)
} else {
      alert("Erreur : " + data.error)
    }
  }

  return (
    <Layout>
      <h3 className="mb-4">📅 Emploi du Temps</h3>

      <div className="d-flex gap-3 mb-3">
        <select
          className="form-select w-auto"
          value={classeSelectionnee}
          onChange={(e) => setClasseSelectionnee(e.target.value)}
        >
          <option value="">Choisir une classe</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.nom || c.libelle}</option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "+ Ajouter un créneau"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-3 p-3">
          <h5>Nouveau créneau</h5>
          <div className="row g-2">
            <div className="col-md-2">
              <label>Jour</label>
              <select className="form-select" value={form.jour}
                onChange={e => setForm({...form, jour: e.target.value})}>
                {jours.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label>Heure début</label>
              <input type="time" className="form-control"
                onChange={e => setForm({...form, heure_debut: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label>Heure fin</label>
              <input type="time" className="form-control"
                onChange={e => setForm({...form, heure_fin: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label>Matière</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Réseaux"
                onChange={e => setForm({...form, matiere_texte: e.target.value})}
              />
            </div>
            <div className="col-md-2">
              <label>Enseignant</label>
              <select className="form-select"
                onChange={e => setForm({...form, id_enseignant: e.target.value})}>
                <option value="">Choisir</option>
                {enseignants.map(e => (
                  <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label>Salle</label>
              <select className="form-select"
                onChange={e => setForm({...form, id_salle: e.target.value})}>
                <option value="">Choisir</option>
                {salles.map(s => (
                  <option key={s.id} value={s.id}>{s.code} ({s.capacite} places)</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-success mt-3" onClick={ajouterCreneau}>
            Enregistrer le créneau
          </button>
        </div>
      )}

      {classeSelectionnee && (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>Heure</th>
                {jours.map(j => <th key={j}>{j}</th>)}
              </tr>
            </thead>
            <tbody>
              {creneaux.length === 0 ? (
                <tr>
                  <td colSpan="7">Aucun créneau disponible</td>
                </tr>
              ) : (
                creneaux.map(c => (
                  <tr key={c.id}>
                    <td>{c.heure_debut} - {c.heure_fin}</td>
                    {jours.map(j => (
                      <td key={j}>
                        {c.jour === j ? `${c.matiere} - ${c.nom} ${c.prenom} (${c.salle})` : ""}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}