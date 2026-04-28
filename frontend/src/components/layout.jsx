import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>
    </div>
  )
}