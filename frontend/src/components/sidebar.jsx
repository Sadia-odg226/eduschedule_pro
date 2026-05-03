import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-dark text-white p-3"
         style={{ width: "220px", minHeight: "100vh" }}>
      
      <p className="fw-bold border-bottom pb-2 mb-3">Menu</p>
      
      <Link to="/emploi-temps" className="text-white text-decoration-none py-2">
        Emploi du temps
      </Link>
      <Link to="/pointage" className="text-white text-decoration-none py-2">
        Pointage QR
      </Link>
      <Link to="/cahier" className="text-white text-decoration-none py-2">
        Cahier de texte
      </Link>
      <Link to="/vacations" className="text-white text-decoration-none py-2">
        Vacations
      </Link>
      <Link to="/dashboard/admin" className="text-white text-decoration-none py-2">
        Tableau de bord
      </Link>
    </div>
  )
}