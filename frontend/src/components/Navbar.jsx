import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#090a0d]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-2 h-2 rounded-full bg-[#c89d7c] group-hover:scale-125 transition-transform" />
          <div className="flex flex-col">
            <span className="font-serif italic text-2xl tracking-wide text-[#f2f0eb] leading-none">Kinship</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7a8190] mt-0.5">Autonomous Courtship Bureau</span>
          </div>
        </Link>

        {/* Center telemetry */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-[#7a8190] bg-[#111318] px-3.5 py-1.5 rounded-full border border-white/[0.06]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>APIFY DUAL-GRAPH ACTIVE</span>
          <span className="text-white/[0.15]">|</span>
          <span className="text-[#a4aab7]">25 SUBJECTS INGESTED</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-xs uppercase tracking-wider font-mono transition-colors ${
              location.pathname === '/' ? 'text-[#c89d7c]' : 'text-[#8b919e] hover:text-[#f2f0eb]'
            }`}
          >
            Subjects
          </Link>
          <Link
            to="/add"
            className="text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#f2f0eb] border border-white/[0.1] transition-all hover:border-[#c89d7c]/40"
          >
            + Ingest Link
          </Link>
        </div>
      </div>
    </nav>
  )
}
