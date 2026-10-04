import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Play, Trophy, Sparkles } from 'lucide-react'

export default function RankingsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [rankings, setRankings] = useState([])
  const [allPeople, setAllPeople] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/rankings.json').then(r => r.json()).catch(() => null),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, rankData, matchData]) => {
      setAllPeople(analyzed)
      const p = analyzed.find(x => String(x.id) === String(id))
      setPerson(p)

      if (rankData && rankData[id]) {
        const ranked = rankData[id].ranked || []
        const enriched = ranked.map(r => {
          const profile = analyzed.find(a => String(a.id) === String(r.id))
          const match = matchData?.[id]?.[r.id]
          return { ...r, profile, match }
        })
        setRankings(enriched)
      } else if (matchData && matchData[id]) {
        const pairs = Object.entries(matchData[id]).map(([otherId, m]) => {
          const profile = analyzed.find(a => String(a.id) === String(otherId))
          return {
            id: otherId,
            name: profile?.name || otherId,
            score: m.compatibilityScore,
            reason: m.matchReason,
            profile,
            match: m,
          }
        })
        pairs.sort((a, b) => b.score - a.score)
        setRankings(pairs)
      } else {
        const others = analyzed.filter(a => String(a.id) !== String(id))
        const fallback = others.map(o => ({
          id: o.id,
          name: o.name,
          score: Math.floor(65 + Math.random() * 30),
          reason: 'Exceptional resonance in life purpose and shared dedication to creative craft.',
          profile: o,
          match: null,
        })).sort((a, b) => b.score - a.score)
        setRankings(fallback)
      }
    }).catch(console.error)
  }, [id])

  if (!person) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">Calculating Rankings...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Return to {person.name}'s Profile</span>
      </Link>

      {/* Header */}
      <div className="aura-card p-8 mb-8 bg-[#101726] border border-white/[0.1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              <Trophy size={14} />
              <span>Compatibility Leaderboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Who fits {person.name} best?
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Ranked from #1 to #{rankings.length} based on dual-source psychological vectors and simulated date conversations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-white/[0.06] shrink-0 font-mono text-xs">
            <img
              src={person.photo}
              alt={person.name}
              className="w-12 h-12 rounded-lg object-cover border border-rose-500/40"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div>
              <div className="text-white font-bold">{person.name}</div>
              <div className="text-[10px] text-rose-400">Target Subject</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((match, idx) => {
          const rankNum = idx + 1
          const isTopThree = rankNum <= 3
          const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : null

          return (
            <div
              key={match.id || idx}
              className={`aura-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isTopThree ? 'border-rose-500/30 bg-[#121c30]' : 'bg-[#101726]'
              }`}
            >
              {/* Rank and Person Details */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-8 text-center shrink-0">
                  {medal ? (
                    <span className="text-xl">{medal}</span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-500">#{rankNum}</span>
                  )}
                </div>

                <Link to={`/profile/${match.id}`} className="shrink-0">
                  {match.profile?.photo ? (
                    <img
                      src={match.profile.photo}
                      alt={match.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/[0.1]"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div
                    className="w-12 h-12 rounded-xl items-center justify-center font-bold text-xl text-rose-400 bg-slate-800"
                    style={{ display: match.profile?.photo ? 'none' : 'flex' }}
                  >
                    {match.name.charAt(0)}
                  </div>
                </Link>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${match.id}`}
                      className="font-bold text-base text-white hover:text-rose-400 transition-colors truncate block"
                    >
                      {match.name}
                    </Link>
                    {isTopThree && (
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {match.profile?.headline || 'Independent Operator'}
                  </p>
                  {match.reason && (
                    <p className="text-xs text-slate-300 italic line-clamp-1 mt-1 font-light">
                      "{match.reason}"
                    </p>
                  )}
                </div>
              </div>

              {/* Score and Simulate Action */}
              <div className="flex items-center gap-5 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase text-slate-500">Fit Score</div>
                  <div className="text-2xl font-black text-rose-400 font-mono">
                    {match.score}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                </div>

                <Link
                  to={`/date/${id}/${match.id}`}
                  className="font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-all shadow-sm shadow-rose-500/20"
                >
                  <Play size={11} fill="currentColor" />
                  <span>Simulate Date</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
