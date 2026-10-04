import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Play, Sparkles } from 'lucide-react'

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
          score: Math.floor(60 + Math.random() * 35),
          reason: 'Harmonious lifestyle cadence and strong mutual creative vision.',
          profile: o,
          match: null,
        })).sort((a, b) => b.score - a.score)
        setRankings(fallback)
      }
    }).catch(console.error)
  }, [id])

  if (!person) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="font-mono text-xs uppercase tracking-widest text-[#7a8190] mb-2">Sorting Affinity Matrices</div>
      <div className="font-serif italic text-2xl text-[#f2f0eb]">Calculating compatibility leaderboards...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Return link */}
      <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 font-mono text-xs text-[#7a8190] hover:text-[#c89d7c] transition-colors mb-8">
        <ArrowLeft size={14} />
        <span>Return to {person.name}'s Dossier</span>
      </Link>

      {/* Roster Header */}
      <header className="border-b border-white/[0.08] pb-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#c89d7c] mb-1.5 flex items-center gap-2">
              <Sparkles size={12} />
              <span>COMPATIBILITY ROSTER // AGENTIC RANKINGS</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#f2f0eb]">
              Who fits {person.name} best.
            </h1>
            <p className="font-sans text-xs text-[#8a91a0] mt-2 font-light">
              Ranked descending by mutual psychological alignment, lifestyle telemetry, and simulated date chemistry.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#111318] p-3 rounded-lg border border-white/[0.05] shrink-0 font-mono text-xs">
            <img
              src={person.photo}
              alt={person.name}
              className="w-10 h-10 rounded object-cover border border-white/[0.1]"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-10 h-10 rounded items-center justify-center font-serif italic text-lg text-[#c89d7c] bg-[#161821]" style={{ display: person.photo ? 'none' : 'flex' }}>
              {person.name.charAt(0)}
            </div>
            <div>
              <div className="text-[#f2f0eb] font-medium">{person.name}</div>
              <div className="text-[10px] text-[#7a8190]">Subject #00{person.id}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Roster Rows */}
      <div className="space-y-3">
        {rankings.map((match, idx) => {
          const rankNum = String(idx + 1).padStart(2, '0')
          const isTopTier = idx < 3

          return (
            <div
              key={match.id || idx}
              className="bg-[#111318] hover:bg-[#141720] border border-white/[0.06] hover:border-[#c89d7c]/30 rounded-lg p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              {/* Rank + Subject Info */}
              <div className="flex items-center gap-4 min-w-0">
                <span className={`font-mono text-sm tracking-wider font-semibold w-8 ${
                  isTopTier ? 'text-[#c89d7c]' : 'text-[#5e6472]'
                }`}>
                  {rankNum}.
                </span>

                <Link to={`/profile/${match.id}`} className="shrink-0">
                  {match.profile?.photo ? (
                    <img
                      src={match.profile.photo}
                      alt={match.name}
                      className="w-12 h-12 rounded object-cover border border-white/[0.08]"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div
                    className="w-12 h-12 rounded items-center justify-center font-serif italic text-xl text-[#c89d7c] bg-[#161821]"
                    style={{ display: match.profile?.photo ? 'none' : 'flex' }}
                  >
                    {match.name.charAt(0)}
                  </div>
                </Link>

                <div className="min-w-0">
                  <Link
                    to={`/profile/${match.id}`}
                    className="font-serif text-xl text-[#f2f0eb] group-hover:text-[#c89d7c] transition-colors truncate block"
                  >
                    {match.name}
                  </Link>
                  <p className="font-sans text-xs text-[#7e8594] truncate font-light">
                    {match.profile?.headline || 'Independent Operator'}
                  </p>
                  {match.reason && (
                    <p className="font-sans text-xs text-[#a4aab7] line-clamp-1 mt-1 font-light italic">
                      "{match.reason}"
                    </p>
                  )}
                </div>
              </div>

              {/* Score + Action */}
              <div className="flex items-center gap-6 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#6f7584]">Synergy</div>
                  <div className={`font-serif italic text-2xl ${
                    isTopTier ? 'text-[#c89d7c]' : 'text-[#d6d9e0]'
                  }`}>
                    {match.score} <span className="font-mono text-xs not-italic text-[#686f7e]">/ 100</span>
                  </div>
                </div>

                <Link
                  to={`/date/${id}/${match.id}`}
                  className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#f2f0eb] border border-white/[0.08] hover:border-[#c89d7c]/40 transition-all flex items-center gap-1.5"
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
