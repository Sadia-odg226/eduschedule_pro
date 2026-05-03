import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Layout from "../components/Layout"

export default function VacationPage() {
  const { user } = useContext(AuthContext)
  const [vacations, setVacations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost/Backend/api/vacations.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVacations(data.data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <Layout>
      <h3 className="mb-4">💰 Fiches de Vacation</h3>

      {loading ? (
        <p>Chargement...</p>
      ) : vacations.length === 0 ? (
        <div className="alert alert-info">
          Aucune fiche de vacation disponible
        </div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Enseignant</th>
              <th>Mois</th>
              <th>Année</th>
              <th>Montant brut (FCFA)</th>
              <th>Montant net (FCFA)</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {vacations.map(v => (
              <tr key={v.id}>
                <td>{v.nom} {v.prenom}</td>
                <td>{v.mois}</td>
                <td>{v.annee}</td>
                <td>{v.montant_brut}</td>
                <td>{v.montant_net}</td>
                <td>
                  <span className={`badge ${
                    v.statut === 'approuvee' ? 'bg-success' :
                    v.statut === 'validee_surveillant' ? 'bg-primary' :
                    v.statut === 'signee_enseignant' ? 'bg-warning' :
                    'bg-secondary'
                  }`}>
                    {v.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}