import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Layout from "../components/Layout"

export default function DashboardAdminPage() {
  const { user } = useContext(AuthContext)

  return (
    <Layout>
      <h3 className="mb-4">📊 Tableau de bord — Administrateur</h3>
      <p>Bienvenue, {user?.email}</p>

      <div className="row g-3 mt-2">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h6>Séances aujourd'hui</h6>
              <h2>8</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h6>Enseignants présents</h6>
              <h2>6</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h6>Absences</h6>
              <h2>2</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h6>Cahiers non signés</h6>
              <h2>3</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}