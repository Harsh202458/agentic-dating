import { Link, useLocation } from 'react-router-dom'
import { Heart, Plus, Users } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <Heart size={16} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
              Agentic Dating
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">
              Agents date on your behalf
            </span>
          </div>
        </Link>

        {/* Center telemetry */}
        <div className="hidden md:flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">25 Real People</span>
          <span className="text-slate-300">•</span>
          <span>LinkedIn + Instagram</span>
          <span className="text-slate-300">•</span>
          <span className="text-rose-600 font-medium">Free to Try</span>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            People
          </Link>

          <Link
            to="/add"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
          >
            <Plus size={14} />
            <span>Add Person</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
