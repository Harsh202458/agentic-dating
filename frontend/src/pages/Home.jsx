import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Sparkles } from 'lucide-react'

export default function Home() {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('./data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        setPeople([...added, ...data])
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
             p.headline?.toLowerCase().includes('engineer') ||
             p.headline?.toLowerCase().includes('meta') ||
             p.headline?.toLowerCase().includes('google')
    }
    if (activeFilter === 'CULTURE') {
      return p.headline?.toLowerCase().includes('creator') ||
             p.headline?.toLowerCase().includes('actor') ||
             p.headline?.toLowerCase().includes('comedian') ||
             p.followers > 1000000
    }
    if (activeFilter === 'SCHOLARS') {
      return p.headline?.toLowerCase().includes('professor') ||
             p.headline?.toLowerCase().includes('author') ||
             p.headline?.toLowerCase().includes('researcher') ||
             p.headline?.toLowerCase().includes('podcast')
    }
    return true
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="font-mono text-xs uppercase tracking-widest text-[#7a8190] mb-2">Ingesting Dual Telemetry</div>
      <div className="font-serif italic text-2xl text-[#f2f0eb]">Loading autonomous subjects...</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* Editorial Masthead */}
      <header className="border-b border-white/[0.08] pb-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#c89d7c] mb-4">
              <Sparkles size={13} />
              <span>Autonomous Courtship Protocol · Dual-Vector Model</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-[#f2f0eb] leading-[1.05] mb-5">
              Agents who date <br />
              <span className="italic text-[#c89d7c]">on human behalf.</span>
            </h1>
            <p className="text-base text-[#9ea3ae] max-w-2xl font-light leading-relaxed">
              Every subject below is embodied by an autonomous agent synthesized exclusively from two public footprints:
              their <span className="text-[#f2f0eb] font-medium">LinkedIn career matrix</span> and their <span className="text-[#f2f0eb] font-medium">Instagram lifestyle graph</span>.
              The agents date each other in private to score real compatibility.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-px bg-white/[0.08] p-px rounded-lg overflow-hidden shrink-0 font-mono text-left">
            <div className="bg-[#111318] p-4">
              <div className="text-[10px] uppercase text-[#6f7584] tracking-wider mb-1">Active Roster</div>
              <div className="text-2xl font-serif italic text-[#f2f0eb]">{people.length} <span className="text-xs font-mono font-normal text-[#8a91a0]">Profiles</span></div>
            </div>
            <div className="bg-[#111318] p-4">
              <div className="text-[10px] uppercase text-[#6f7584] tracking-wider mb-1">Pairwise Simulations</div>
              <div className="text-2xl font-serif italic text-[#c89d7c]">600 <span className="text-xs font-mono font-normal text-[#8a91a0]">Dates</span></div>
            </div>
            <div className="bg-[#111318] p-4">
              <div className="text-[10px] uppercase text-[#6f7584] tracking-wider mb-1">Scraper Engine</div>
              <div className="text-xs text-[#a4aab7] font-sans">Apify Node SDK</div>
            </div>
            <div className="bg-[#111318] p-4">
              <div className="text-[10px] uppercase text-[#6f7584] tracking-wider mb-1">Synthesizer</div>
              <div className="text-xs text-[#a4aab7] font-sans">Gemini 1.5 Flash</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-10 pt-8 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'ALL', label: `All Cohorts (${people.length})` },
              { id: 'TECH', label: 'Founders & Tech' },
              { id: 'SCHOLARS', label: 'Thinkers & Authors' },
              { id: 'CULTURE', label: 'Media & Culture' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`font-mono text-xs px-3.5 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#f2f0eb] text-[#090a0d] font-semibold'
                    : 'bg-[#13151b] text-[#8b919e] hover:text-[#f2f0eb] border border-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#686f7e]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, trait, or title..."
              className="w-full pl-9 pr-4 py-2 bg-[#12141a] border border-white/[0.08] focus:border-[#c89d7c]/40 rounded text-xs text-[#f2f0eb] placeholder-[#686f7e] outline-none font-mono"
            />
          </div>
        </div>
      </header>

      {/* Grid of Dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((person, idx) => (
          <DossierCard key={person.id} person={person} index={idx} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/[0.08] rounded-xl">
          <p className="font-serif italic text-2xl text-[#8b919e] mb-2">No subjects match this inquiry</p>
          <p className="font-mono text-xs text-[#5e6472]">Try another keyword or <Link to="/add" className="text-[#c89d7c] underline">ingest a new public profile</Link>.</p>
        </div>
      )}
    </div>
  )
}

function DossierCard({ person, index }) {
  const code = `SUBJ-${String(index + 1).padStart(3, '0')}`

  return (
    <article className="dossier-card flex flex-col justify-between p-6 group">
      <div>
        {/* Header row: ID + Status */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-5">
          <span className="font-mono text-[10px] text-[#6b7280] tracking-widest">{code}</span>
          <div className="flex items-center gap-2">
            {person.isVerified && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Verified Link
              </span>
            )}
            <span className="font-mono text-[9px] text-[#8b919e]">2 Vectors</span>
          </div>
        </div>

        {/* Person Primary Metadata */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="w-16 h-16 rounded-lg object-cover grayscale-[20%] group-hover:grayscale-0 transition-all border border-white/[0.1]"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
            ) : null}
            <div
              className="w-16 h-16 rounded-lg items-center justify-center font-serif italic text-2xl text-[#c89d7c] bg-[#1a1c24] border border-white/[0.1]"
              style={{ display: person.photo ? 'none' : 'flex' }}
            >
              {person.name.charAt(0)}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-2xl text-[#f2f0eb] group-hover:text-[#c89d7c] transition-colors truncate">
              {person.name}
            </h2>
            <p className="font-sans text-xs text-[#8a91a0] line-clamp-2 mt-0.5 leading-snug">
              {person.headline || 'Independent Operator'}
            </p>
          </div>
        </div>

        {/* Synthesized Voice Snippet */}
        <div className="bg-[#151820] border-l-2 border-[#c89d7c]/60 p-3 rounded-r mb-4">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[#7e8594] mb-1">Agent Voice Signature</div>
          <p className="font-serif italic text-sm text-[#d8d6cf] line-clamp-2">
            "{person.agentVoice || `I represent ${person.name} — looking for shared depth and ambition.`}"
          </p>
        </div>

        {/* Extracted Core Tags */}
        <div className="space-y-2 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {(person.needs || []).slice(0, 2).map(need => (
              <span key={need} className="badge-tag">
                Need: {need}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(person.hobbies || []).slice(0, 2).map(h => (
              <span key={h} className="badge-tag border-white/[0.04] text-[#8e95a5]">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <Link
          to={`/rankings/${person.id}`}
          className="font-mono text-[11px] text-[#7f8695] hover:text-[#c89d7c] transition-colors flex items-center gap-1"
        >
          Compatibility Index →
        </Link>
        <Link
          to={`/profile/${person.id}`}
          className="font-mono text-xs font-medium text-[#f2f0eb] hover:text-[#c89d7c] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
        >
          <span>Open Dossier</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  )
}
