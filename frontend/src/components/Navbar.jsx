import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Grid, Users, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-white">
              <span>AURA</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AGENTIC DATING
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 -mt-0.5 tracking-wider">
              DUAL-SOURCE COURTSHIP PROTOCOL
            </div>
          </div>
        </Link>

        {/* Center telemetry */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-400 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>APIFY DUAL-SCRAPER</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200">25 REAL SUBJECTS</span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-400">600 SIMULATED DATES</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-white/[0.08] text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span className="hidden sm:inline">Subjects (25)</span>
          </Link>

          <Link
            to="/matrix"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/matrix' ? 'bg-white/[0.08] text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid size={14} />
            <span className="hidden sm:inline">Affinity Matrix</span>
          </Link>

          <Link
            to="/add"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all shadow-sm shadow-rose-500/20 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Add Person</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
