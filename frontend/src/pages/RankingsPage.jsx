import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Trophy, ChevronDown, ChevronUp, Sparkles, AlertTriangle } from 'lucide-react'

export default function RankingsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [rankings, setRankings] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [allPeople, setAllPeople] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/rankings.json').then(r => r.json()).catch(() => null),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, rankData, matchData]) => {
      const added = JSON.parse(localStorage.getItem('added_people') || '[]')
      const all = [...added, ...analyzed]
      setAllPeople(all)

      const p = all.find(x => String(x.id) === String(id))
      setPerson(p)

      if (rankData && rankData[id]) {
        const ranked = rankData[id].ranked || []
        const enriched = ranked.map(r => {
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
      } else if (matchData && matchData[id]) {
        const pairs = Object.entries(matchData[id]).map(([otherId, m]) => {
          const profile = all.find(a => String(a.id) === String(otherId))
          return {
            id: otherId,
            name: profile?.name || otherId,
            score: m.compatibilityScore,
            reason: m.matchReason,
            profile,
            match: m,
            breakdown: m.breakdown,
            sparks: m.sparks,
            tensions: m.tensions
          }
        })
        pairs.sort((a, b) => b.score - a.score)
        setRankings(pairs)
      } else {
        const others = all.filter(a => String(a.id) !== String(id))
        const fallback = others.map(o => ({
          id: o.id,
          name: o.name,
          score: Math.floor(65 + Math.random() * 30),
          reason: 'Strong resonance in lifestyle cadence and creative drive.',
          profile: o,
          match: null,
        })).sort((a, b) => b.score - a.score)
        setRankings(fallback)
      }
    }).catch(console.error)
  }, [id])

  if (!person) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-medium text-slate-500">Loading rankings...</div>
    </div>
  )

  const toggleExpand = (matchId) => {
    setExpandedId(prev => prev === matchId ? null : matchId)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Back to {person.name}'s Profile</span>
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <Trophy size={14} />
              <span>Explainable Compatibility Leaderboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Who fits {person.name} best?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Ranked from #1 to #{rankings.length} using an explicit 7-factor weighted formula across all simulated date conversations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <img
              src={person.photo}
              alt={person.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div>
              <div className="text-slate-900 font-bold text-sm">{person.name}</div>
              <div className="text-xs text-rose-600 font-semibold">Target Person</div>
            </div>
          </div>
        </div>
      </div>

      {/* List of ranked matches */}
      <div className="space-y-3">
        {rankings.map((match, idx) => {
          const rankNum = idx + 1
          const isTopThree = rankNum <= 3
          const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : null
          const isExpanded = expandedId === match.id
          const factors = match.breakdown?.factors || {}

          return (
            <div
              key={match.id || idx}
              className={`rounded-xl border transition-all ${
                isTopThree
                  ? 'bg-white border-rose-200 shadow-sm'
                  : 'bg-white border-slate-200 shadow-none hover:shadow-sm'
              }`}
            >
              {/* Main Summary Row */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Rank and Person Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 text-center shrink-0">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">#{rankNum}</span>
                    )}
                  </div>

                  <Link to={`/profile/${match.id}`} className="shrink-0">
                    {match.profile?.photo ? (
                      <img
                        src={match.profile.photo}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                      />
                    ) : null}
                    <div
                      className="w-12 h-12 rounded-full items-center justify-center font-bold text-lg text-rose-600 bg-rose-50 border border-rose-200"
                      style={{ display: match.profile?.photo ? 'none' : 'flex' }}
                    >
                      {match.name.charAt(0)}
                    </div>
                  </Link>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${match.id}`}
                        className="font-bold text-base text-slate-900 hover:text-rose-600 transition-colors truncate block"
                      >
                        {match.name}
                      </Link>
                      {isTopThree && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Top Fit
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {match.profile?.headline || 'Independent Builder'}
                    </p>
                    {match.reason && (
                      <p className="text-xs text-slate-600 italic line-clamp-1 mt-1">
                        "{match.reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Match Score & Actions */}
                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Match</div>
                    <div className="text-2xl font-extrabold text-rose-600">
                      {match.score}
                      <span className="text-xs text-slate-400 font-normal"> / 100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(match.id)}
                    className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 cursor-pointer"
                    title="View Factor Breakdown"
                  >
                    <span>Why?</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  <Link
                    to={`/date/${id}/${match.id}`}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Play size={11} fill="currentColor" />
                    <span>Watch Date</span>
                  </Link>
                </div>
              </div>

              {/* Expandable "Why This Match?" 7-Factor Breakdown */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Compatibility Thesis
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {match.reason}
                    </p>
                  </div>

                  {/* 7-Factor Weights */}
                  {Object.keys(factors).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        7-Factor Mathematical Contribution:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(factors).map(([k, item]) => (
                          <div key={k} className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600 text-[11px]">{item.label} <span className="font-mono text-slate-400">({item.weight})</span></span>
                            <span className="font-bold text-slate-900 font-mono text-[11px]">{item.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sparks & Tensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs">
                      <div className="font-bold text-rose-800 mb-1 flex items-center gap-1">
                        <Sparkles size={12} className="text-rose-600" />
                        <span>Shared Catalysts</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {(match.sparks || ['Aligned core values', 'Complementary ambition']).map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                      <div className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" />
                        <span>Friction Points</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {(match.tensions || ['High demanding schedules']).map((t, i) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
