export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-dark text-white p-3"
         style={{ width: "220px", minHeight: "100vh" }}>
      
      <p className="fw-bold border-bottom pb-2 mb-3">Menu</p>
      
      <a href="#" className="text-white text-decoration-none py-2">
        📅 Emploi du temps
      </a>
      <a href="#" className="text-white text-decoration-none py-2">
        📷 Pointage QR
      </a>
      <a href="#" className="text-white text-decoration-none py-2">
        📓 Cahier de texte
      </a>
      <a href="#" className="text-white text-decoration-none py-2">
        💰 Vacations
      </a>
      <a href="#" className="text-white text-decoration-none py-2">
        📊 Tableau de bord
      </a>
    </div>
  )
}