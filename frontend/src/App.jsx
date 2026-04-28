import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4">
          <h1>🎓 EduSchedule Pro</h1>
        </div>
      </div>
    </div>
  )
}