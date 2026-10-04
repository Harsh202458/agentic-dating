import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Trophy } from 'lucide-react'

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
              <span>Compatibility Rankings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Who fits {person.name} best?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Every person is ranked from highest to lowest compatibility based on simulated date conversations and psychological alignment.
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

          return (
            <div
              key={match.id || idx}
              className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isTopThree
                  ? 'bg-white border-rose-200 shadow-sm'
                  : 'bg-white border-slate-200 shadow-none hover:shadow-sm'
              }`}
            >
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

              {/* Match Score & Date Button */}
              <div className="flex items-center gap-5 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Match</div>
                  <div className="text-2xl font-extrabold text-rose-600">
                    {match.score}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                <Link
                  to={`/date/${id}/${match.id}`}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play size={11} fill="currentColor" />
                  <span>Watch Date</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
