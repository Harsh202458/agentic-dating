import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, ArrowUpRight, Sparkles, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

export default function RankingsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [rankings, setRankings] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/rankings.json').then(r => r.json()).catch(() => null),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, rankData, matchData]) => {
      const added = JSON.parse(localStorage.getItem('added_people') || '[]')
      const all = [...added, ...analyzed]
      const p = all.find(x => String(x.id) === String(id))
      setPerson(p)

      if (rankData && rankData[id]) {
        const enriched = (rankData[id].ranked || []).map(r => {
          const profile = all.find(a => String(a.id) === String(r.id))
          const match = matchData?.[id]?.[r.id]
          return {
            ...r,
            profile,
            match,
            breakdown: r.breakdown || match?.breakdown,
            sparks: r.sparks || match?.sparks,
            tensions: r.tensions || match?.tensions
          }
        })
        setRankings(enriched)
      }
    }).catch(console.error)
  }, [id])

  if (!person) return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center font-mono text-xs text-slate-500">
      Loading Ranking Universe...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#05050a] text-white pt-24 pb-20 px-6 selection:bg-rose-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Return */}
        <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-10">
          <ArrowLeft size={14} />
          <span>RETURN TO {person.name.toUpperCase()}'S DOSSIER</span>
        </Link>

        {/* Cinematic Title Header */}
        <div className="mb-14 border-b border-white/[0.08] pb-8">
          <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-semibold mb-2">
            Target Subject: {person.name}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white uppercase glow-text-white mb-4">
            WHO WOULD YOUR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-sky-400">
              AGENT CHOOSE?
            </span>
          </h1>
          <p className="text-slate-400 text-sm font-light max-w-xl">
            Ranked from #01 to #{rankings.length} based on autonomous 3-round date simulations and explicit 7-factor weighted alignment.
          </p>
        </div>

        {/* Large Vertical Cinematic Leaderboard */}
        <div className="space-y-6">
          {rankings.map((match, idx) => {
            const rankNum = String(idx + 1).padStart(2, '0')
            const isTop = idx === 0
            const isExpanded = expandedId === match.id

            return (
              <div
                key={match.id}
                className={`glass-panel rounded-2xl transition-all duration-300 ${
                  isTop ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : 'border-white/[0.08]'
                }`}
              >
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Left: Rank + Info */}
                  <div className="flex items-start sm:items-center gap-6">
                    <div className="font-mono text-3xl sm:text-5xl font-black text-slate-500 select-none">
                      {rankNum}
                    </div>

                    <Link to={`/profile/${match.id}`} className="relative shrink-0">
                      <img
                        src={match.profile?.photo}
                        alt={match.name}
                        className="w-16 h-16 rounded-full object-cover border border-white/20"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </Link>

                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/profile/${match.id}`} className="text-xl sm:text-2xl font-extrabold text-white hover:text-rose-400 transition-colors">
                          {match.name}
                        </Link>
                        {isTop && (
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase tracking-wider">
                            OPTIMAL RESONANCE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{match.profile?.headline}</div>

                      {/* Top tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(match.profile?.interests || []).slice(0, 3).map((int, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Big Score + Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 self-stretch sm:self-auto border-t sm:border-t-0 border-white/[0.08] pt-4 sm:pt-0">
                    <div className="text-right">
                      <div className="font-mono text-3xl sm:text-4xl font-black text-rose-400">
                        {match.score}%
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 uppercase">COMPATIBILITY</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : match.id)}
                        className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Toggle Intelligence Thesis"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <Link
                        to={`/date/${id}/${match.id}`}
                        className="px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-transform hover:scale-105"
                      >
                        <Play size={11} fill="currentColor" />
                        <span>DATE</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded Intelligence Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-white/[0.08] space-y-4 font-mono text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-rose-400 font-bold mb-1">COMPATIBILITY THESIS</div>
                      <p className="text-slate-300 text-xs font-sans italic leading-relaxed">
                        "{match.reason}"
                      </p>
                    </div>

                    {match.breakdown?.factors && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {Object.entries(match.breakdown.factors).map(([k, item]) => (
                          <div key={k} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">{item.label} ({item.weight})</span>
                            <span className="text-white font-bold">{item.score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
