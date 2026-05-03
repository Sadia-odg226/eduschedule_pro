import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Layout from "../components/Layout"

export default function DashboardEnseignantPage() {
  const { user } = useContext(AuthContext)

  return (
    <Layout>
      <h3 className="mb-4">📋 Tableau de bord — Enseignant</h3>
      <p>Bienvenue, {user?.email}</p>

      <div className="row g-3 mt-2">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              Mes séances
            </div>
            <div className="card-body">
              <p>Aucune séance aujourd'hui</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              Mes fiches de vacation
            </div>
            <div className="card-body">
              <p>Aucune fiche disponible</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}