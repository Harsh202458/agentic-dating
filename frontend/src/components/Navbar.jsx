import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Plus, Users, Play, Trophy } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-200">
      <div className="max-w-6xl mx-auto glass-panel px-5 py-2.5 rounded-full flex items-center justify-between border border-white/[0.08]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-sky-400 p-[1.5px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#05050a] rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-widest text-white uppercase">
            MATCHROOM
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1 font-mono text-[11px] text-slate-300">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full transition-colors ${
              location.pathname === '/' ? 'text-white bg-white/[0.08] font-bold' : 'hover:text-white'
            }`}
          >
            DISCOVER
          </Link>
          <a
            href="#cohort"
            className="px-3 py-1.5 rounded-full hover:text-white transition-colors"
          >
            PEOPLE (25)
          </a>
          <Link
            to="/date/1/3"
            className={`px-3 py-1.5 rounded-full transition-colors ${
              location.pathname.startsWith('/date') ? 'text-white bg-white/[0.08] font-bold' : 'hover:text-white'
            }`}
          >
            DATES
          </Link>
          <Link
            to="/rankings/1"
            className={`px-3 py-1.5 rounded-full transition-colors ${
              location.pathname.startsWith('/rankings') ? 'text-white bg-white/[0.08] font-bold' : 'hover:text-white'
            }`}
          >
            MATCHES
          </Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/add"
            className="flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Plus size={13} />
            <span>CREATE AGENT</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
