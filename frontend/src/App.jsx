import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import ProfilePage from './pages/ProfilePage'
import DatePage from './pages/DatePage'
import RankingsPage from './pages/RankingsPage'
import MatrixView from './pages/MatrixView'
import AddPerson from './pages/AddPerson'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#090d16] text-[#f8fafc]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/date/:id1/:id2" element={<DatePage />} />
          <Route path="/rankings/:id" element={<RankingsPage />} />
          <Route path="/matrix" element={<MatrixView />} />
          <Route path="/add" element={<AddPerson />} />
        </Routes>
      </div>
    </Router>
  )
}
