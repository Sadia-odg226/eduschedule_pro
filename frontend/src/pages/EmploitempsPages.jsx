import { useState, useEffect } from "react"
import { getEmploiTemps, getClasses } from "../services/api"
import Layout from "../components/Layout"

export default function EmploiTempsPage() {
  const [creneaux, setCreneaux] = useState([])
  const [classes, setClasses] = useState([])
  const [classeSelectionnee, setClasseSelectionnee] = useState("")
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

  useEffect(() => {
    getClasses().then(data => {
      if (data.success) setClasses(data.data)
    })
  }, [])

  useEffect(() => {
    if (classeSelectionnee) {
      getEmploiTemps(classeSelectionnee).then(data => {
        if (data.success) setCreneaux(data.data)
      })
    }
  }, [classeSelectionnee])

  return (
    <Layout>
      <h3 className="mb-4">📅 Emploi du Temps</h3>

      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={classeSelectionnee}
          onChange={(e) => setClasseSelectionnee(e.target.value)}
        >
          <option value=""> Choisir une classe </option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.nom || c.libelle}</option>
          ))}
        </select>
      </div>

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
                        {c.jour === j ? c.matiere : ""}
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