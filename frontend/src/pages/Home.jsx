import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Play, ArrowRight, Heart, Sparkles, Trophy, UserCheck, ShieldCheck } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function Home() {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('./data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        const all = [...added, ...data]
        setPeople(all)
        if (all.length >= 2) {
          setP1(String(all[0].id))
          setP2(String(all[1].id))
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

    if (activeFilter === 'TECH') {
      return p.headline?.toLowerCase().includes('founder') ||
             p.headline?.toLowerCase().includes('ceo') ||
             p.headline?.toLowerCase().includes('meta') ||
             p.headline?.toLowerCase().includes('google')
    }
    if (activeFilter === 'THINKERS') {
      return p.headline?.toLowerCase().includes('professor') ||
             p.headline?.toLowerCase().includes('author') ||
             p.headline?.toLowerCase().includes('researcher') ||
             p.headline?.toLowerCase().includes('podcast')
    }
    if (activeFilter === 'CREATORS') {
      return p.headline?.toLowerCase().includes('creator') ||
             p.headline?.toLowerCase().includes('actor') ||
             p.headline?.toLowerCase().includes('comedian') ||
             p.followers > 1000000
    }
    return true
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-medium text-slate-500">Loading 25 profiles...</div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-4 border border-rose-200">
          <ShieldCheck size={13} className="text-rose-600" />
          <span>Dual-Source Protocol · LinkedIn + Instagram Only · 25 Real People</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Each person is an agent. <br />
          <span className="text-rose-600">The agents date each other.</span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Every person is represented by an AI agent trained exclusively on their official <strong className="text-slate-900">LinkedIn</strong> and public <strong className="text-slate-900">Instagram</strong>. The agents simulate multi-turn dates and compute explainable mutual compatibility rankings.
        </p>

        {/* Quick Date Simulator Box */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-left">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Play size={13} className="text-rose-600 fill-rose-600" />
              <span>Interactive Dating Room: Pick Any Two Agents</span>
            </span>
            <span className="text-xs text-slate-400">3-Round Dialogue + Verdict</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={p1}
              onChange={e => setP1(e.target.value)}
              className="w-full sm:flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
            >
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <span className="text-slate-400 font-bold text-sm">with</span>

            <select
              value={p2}
              onChange={e => setP2(e.target.value)}
              className="w-full sm:flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
            >
              {people.filter(p => String(p.id) !== String(p1)).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {p1 && p2 && p1 !== p2 && (
              <Link
                to={`/date/${p1}/${p2}`}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
              >
                <span>Launch Date</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'ALL', label: `All People (${people.length})` },
            { id: 'TECH', label: 'Tech & Founders' },
            { id: 'THINKERS', label: 'Thinkers & Scholars' },
            { id: 'CREATORS', label: 'Creators & Media' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, career, or hobby..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 outline-none shadow-sm focus:border-slate-400"
          />
        </div>
      </div>

      {/* Grid of 25 People Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(person => (
          <PersonCard key={person.id} person={person} allPeople={people} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-600 font-medium">No one found matching "{search}"</p>
          <p className="text-xs text-slate-400 mt-1">Try another search or add a new person.</p>
        </div>
      )}
    </div>
  )
}

function PersonCard({ person, allPeople }) {
  const potentialDates = allPeople.filter(p => p.id !== person.id)
  const defaultPartner = potentialDates.length > 0 ? potentialDates[0] : null

  return (
    <div className="profile-card p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header: Status Indicator + Social Links */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Agent Status: Ready & Ranked</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-[#0077b5] transition-colors"
              title="Official LinkedIn"
            >
              <LinkedinIcon size={14} className="text-[#0077b5]" />
            </a>
            <a
              href={person.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
              title="Official Instagram"
            >
              <InstagramIcon size={14} className="text-rose-600" />
            </a>
          </div>
        </div>

        {/* Avatar + Identity */}
        <div className="flex items-start gap-3.5 mb-3">
          <img
            src={person.photo}
            alt={person.name}
            className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          <div
            className="w-14 h-14 rounded-full items-center justify-center font-bold text-xl text-rose-600 bg-rose-50 border border-rose-200 shadow-sm shrink-0"
            style={{ display: person.photo ? 'none' : 'flex' }}
          >
            {person.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <Link
              to={`/profile/${person.id}`}
              className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors block truncate"
            >
              {person.name}
            </Link>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {person.location || 'Global'}
            </div>
            <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-snug mt-1">
              {person.headline || 'Independent Builder'}
            </p>
          </div>
        </div>

        {/* Agent Voice Quote */}
        <div className="p-3 bg-slate-50 border-l-2 border-rose-500 rounded-r-lg mb-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-0.5">
            Agent Dating Persona
          </div>
          <p className="text-xs text-slate-700 italic line-clamp-2">
            "{person.agentVoice || `I represent ${person.name} in dating simulations.`}"
          </p>
        </div>

        {/* Extracted Needs & Hobbies Tags */}
        <div className="space-y-1 mb-4">
          <div className="flex flex-wrap gap-1">
            {(person.needs || []).slice(0, 2).map((need, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Need: {need}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {(person.hobbies || []).slice(0, 2).map((h, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions (View Profile, Start Dating, View Matches) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs font-semibold">
        <Link
          to={`/profile/${person.id}`}
          className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
        >
          View Profile
        </Link>

        {defaultPartner && (
          <Link
            to={`/date/${person.id}/${defaultPartner.id}`}
            className="px-2.5 py-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
          >
            <Play size={10} fill="currentColor" />
            <span>Start Dating</span>
          </Link>
        )}

        <Link
          to={`/rankings/${person.id}`}
          className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
        >
          View Matches
        </Link>
      </div>
    </div>
  )
}
