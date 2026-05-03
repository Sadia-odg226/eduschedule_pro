import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Layout from "../components/Layout"

export default function VacationPage() {
  const { user } = useContext(AuthContext)

  return (
    <Layout>
      <h3 className="mb-4">💰 Fiches de Vacation</h3>
      <p>Bienvenue, {user?.email}</p>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Mois</th>
            <th>Heures</th>
            <th>Montant (FCFA)</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="text-center">
              Aucune fiche de vacation disponible
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  )
}