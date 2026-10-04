import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Play, Users, Sparkles, Filter, Grid, CheckCircle2 } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function Home() {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [quickP1, setQuickP1] = useState('')
  const [quickP2, setQuickP2] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('./data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        const all = [...added, ...data]
        setPeople(all)
        if (all.length >= 2) {
          setQuickP1(String(all[0].id))
          setQuickP2(String(all[1].id))
        }
        setLoading(false)
      })
      .catch(() => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        setPeople(added)
        setLoading(false)
      })
  }, [])

  const filtered = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.headline && p.headline.toLowerCase().includes(search.toLowerCase())) ||
      (p.hobbies && p.hobbies.some(h => h.toLowerCase().includes(search.toLowerCase())))

    if (!matchesSearch) return false

    if (selectedCategory === 'TECH') {
      return p.headline?.toLowerCase().includes('founder') ||
             p.headline?.toLowerCase().includes('ceo') ||
             p.headline?.toLowerCase().includes('meta') ||
             p.headline?.toLowerCase().includes('google')
    }
    if (selectedCategory === 'SCHOLAR') {
      return p.headline?.toLowerCase().includes('professor') ||
             p.headline?.toLowerCase().includes('researcher') ||
             p.headline?.toLowerCase().includes('author') ||
             p.headline?.toLowerCase().includes('host')
    }
    if (selectedCategory === 'MEDIA') {
      return p.headline?.toLowerCase().includes('creator') ||
             p.headline?.toLowerCase().includes('actor') ||
             p.headline?.toLowerCase().includes('comedian') ||
             p.followers > 1000000
    }
    return true
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">Ingesting 25 Dual-Source Profiles</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111827] to-[#0d1424] border border-white/[0.08] p-8 md:p-12 mb-12 shadow-2xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-5">
            <Sparkles size={13} />
            <span>Dual-Source Telemetry · Apify Scraped · Gemini Synthesized</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
            Each person is an agent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300">
              The agents date each other.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-8">
            Built for 25 real individuals with official <span className="text-white font-medium">LinkedIn</span> and public <span className="text-white font-medium">Instagram</span> footprints.
            Each agent reads both sources, extracts psychological needs & dealbreakers, dates prospective agents in multi-turn dialogue, and generates ranked compatibility leaderboards.
          </p>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Real Subjects</div>
              <div className="text-xl font-bold text-white mt-0.5">{people.length} People</div>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Pairwise Dates</div>
              <div className="text-xl font-bold text-rose-400 mt-0.5">600 Pairs</div>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Scraper Stack</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Apify Actors</div>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Analysis Engine</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Gemini Flash</div>
            </div>
          </div>
        </div>

        {/* Quick Date Simulation Bar right on Hero */}
        <div className="mt-8 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Instant Date Simulator:</span>
            <span>Simulate a date between any two subjects right now</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={quickP1}
              onChange={e => setQuickP1(e.target.value)}
              className="bg-slate-900 border border-white/[0.1] rounded px-3 py-1.5 font-mono text-xs text-white outline-none cursor-pointer"
            >
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <span className="text-rose-400 font-mono text-xs font-bold">×</span>

            <select
              value={quickP2}
              onChange={e => setQuickP2(e.target.value)}
              className="bg-slate-900 border border-white/[0.1] rounded px-3 py-1.5 font-mono text-xs text-white outline-none cursor-pointer"
            >
              {people.filter(p => String(p.id) !== String(quickP1)).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {quickP1 && quickP2 && quickP1 !== quickP2 && (
              <Link
                to={`/date/${quickP1}/${quickP2}`}
                className="font-mono text-xs font-bold px-4 py-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-all shadow-sm shadow-rose-500/20"
              >
                <Play size={12} fill="currentColor" />
                <span>Simulate Date</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'ALL', label: `All Cohorts (${people.length})` },
            { id: 'TECH', label: 'Founders & Technologists' },
            { id: 'SCHOLAR', label: 'Scholars & Thinkers' },
            { id: 'MEDIA', label: 'Creators & Icons' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-mono text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 font-bold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, hobby, or role..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/[0.08] focus:border-rose-500/40 rounded-lg font-mono text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((person, idx) => (
          <SubjectCard key={person.id} person={person} index={idx} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-900/40 border border-dashed border-white/[0.08] rounded-xl">
          <Users size={32} className="mx-auto text-slate-600 mb-3" />
          <p className="text-white font-medium">No subjects found matching your query</p>
          <p className="font-mono text-xs text-slate-500 mt-1">Try another search term or ingest a new public link.</p>
        </div>
      )}
    </div>
  )
}

function SubjectCard({ person, index }) {
  const code = `SUBJ-${String(index + 1).padStart(3, '0')}`

  return (
    <div className="aura-card p-6 flex flex-col justify-between group">
      <div>
        {/* Header row: ID + Dual Links */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{code}</span>
          <div className="flex items-center gap-2">
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded bg-slate-800 hover:bg-[#0077b5]/20 text-slate-400 hover:text-[#0077b5] transition-colors"
              title="View LinkedIn Profile"
            >
              <LinkedinIcon size={13} className="text-[#0077b5]" />
            </a>
            <a
              href={person.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="View Instagram Profile"
            >
              <InstagramIcon size={13} className="text-rose-400" />
            </a>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={person.photo}
              alt={person.name}
              className="w-16 h-16 rounded-xl object-cover border border-white/[0.1] shadow-md"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div
              className="w-16 h-16 rounded-xl items-center justify-center font-bold text-2xl text-rose-400 bg-slate-800 border border-white/[0.1]"
              style={{ display: person.photo ? 'none' : 'flex' }}
            >
              {person.name.charAt(0)}
            </div>
            {person.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]" title="Verified Profile">
                ✓
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Link
              to={`/profile/${person.id}`}
              className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors truncate block"
            >
              {person.name}
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">
              {person.headline || 'Independent Operator'}
            </p>
          </div>
        </div>

        {/* Synthesized Voice Snippet */}
        <div className="bg-slate-900/90 border-l-2 border-rose-500/80 p-3 rounded-r-lg mb-4">
          <div className="font-mono text-[9px] uppercase tracking-wider text-rose-400 font-semibold mb-1">
            Agent Dating Voice
          </div>
          <p className="text-xs text-slate-300 italic line-clamp-2">
            "{person.agentVoice || `I represent ${person.name} — looking for shared depth and ambition.`}"
          </p>
        </div>

        {/* Extracted Core Tags */}
        <div className="space-y-2 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {(person.needs || []).slice(0, 2).map((need, i) => (
              <span key={i} className="data-pill text-slate-300 bg-slate-900/60">
                Need: {need}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(person.hobbies || []).slice(0, 2).map((h, i) => (
              <span key={i} className="data-pill text-slate-400 border-white/[0.04]">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <Link
          to={`/rankings/${person.id}`}
          className="font-mono text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <span>Fit Rankings →</span>
        </Link>
        <Link
          to={`/profile/${person.id}`}
          className="font-mono text-xs font-semibold px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center gap-1 transition-all"
        >
          <span>Examine Profile</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  )
}
