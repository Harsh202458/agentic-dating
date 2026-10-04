import { Link, useLocation } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b" style={{
      background: 'rgba(15, 10, 20, 0.9)',
      backdropFilter: 'blur(12px)',
      borderColor: 'rgba(244, 63, 94, 0.2)',
    }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Heart className="heartbeat" style={{ color: '#f43f5e' }} size={22} fill="#f43f5e" />
          <span className="gradient-text">AgentDate</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={`hover:text-rose-400 transition-colors ${location.pathname === '/' ? 'text-rose-400' : 'text-gray-400'}`}>
            People
          </Link>
          <Link to="/add" className="px-4 py-1.5 rounded-full text-white font-semibold transition-all" style={{
            background: 'linear-gradient(135deg, #f43f5e, #c026d3)',
          }}>
            + Add Person
          </Link>
        </div>
      </div>
    </nav>
  )
}
