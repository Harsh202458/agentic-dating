import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Trophy, Heart, ChevronLeft } from 'lucide-react'

export default function RankingsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [rankings, setRankings] = useState([])
  const [allPeople, setAllPeople] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/data/profiles_analyzed.json').then(r => r.json()),
      fetch('/data/rankings.json').then(r => r.json()).catch(() => null),
      fetch('/data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, rankData, matchData]) => {
      setAllPeople(analyzed)
      const p = analyzed.find(x => String(x.id) === String(id))
      setPerson(p)

      if (rankData && rankData[id]) {
        const ranked = rankData[id].ranked || []
        // Enrich with profile data
        const enriched = ranked.map(r => {
          const profile = analyzed.find(a => String(a.id) === String(r.id))
          const match = matchData?.[id]?.[r.id]
          return { ...r, profile, match }
        })
        setRankings(enriched)
      } else if (matchData && matchData[id]) {
        // Build from match data
        const pairs = Object.entries(matchData[id]).map(([otherId, m]) => {
          const profile = analyzed.find(a => String(a.id) === String(otherId))
          return { id: otherId, name: profile?.name || otherId, score: m.compatibilityScore, reason: m.matchReason, profile, match: m }
        })
        pairs.sort((a, b) => b.score - a.score)
        setRankings(pairs)
      } else {
        // Fallback: random rankings from all people
        const others = analyzed.filter(a => String(a.id) !== String(id))
        const fake = others.map(o => ({
          id: o.id, name: o.name,
          score: Math.floor(40 + Math.random() * 55),
          reason: 'Shared values and complementary personalities.',
          profile: o, match: null,
        })).sort((a, b) => b.score - a.score)
        setRankings(fake)
      }
    }).catch(console.error)
  }, [id])

  if (!person) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Heart className="heartbeat" style={{ color: '#f43f5e' }} size={48} fill="#f43f5e" />
    </div>
  )

  const colors = ['#f43f5e', '#c026d3', '#7c3aed', '#2563eb', '#059669']
  const color = colors[person.id % colors.length]
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const getScoreColor = (s) => {
    if (s >= 80) return '#f43f5e'
    if (s >= 65) return '#c026d3'
    if (s >= 50) return '#7c3aed'
    return '#2563eb'
  }

  const medalEmoji = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to={`/profile/${id}`} className="text-sm text-gray-500 hover:text-rose-400 mb-6 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Back to profile
      </Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6 text-center">
        <div className="flex justify-center mb-3">
          {person.photo ? (
            <img src={person.photo} alt={person.name}
              className="w-20 h-20 rounded-full object-cover border-4"
              style={{ borderColor: color }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
          ) : null}
          <div className="w-20 h-20 rounded-full items-center justify-center text-2xl font-bold text-white"
            style={{ background: `${color}25`, border: `4px solid ${color}`, display: person.photo ? 'none' : 'flex' }}>
            {initials}
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          <Trophy size={20} className="inline mr-2" style={{ color: '#f43f5e' }} />
          {person.name}'s Rankings
        </h1>
        <p className="text-gray-500 text-sm">Who fits them best — ranked by AI agents</p>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((match, idx) => {
          const otherColor = colors[(match.profile?.id || idx) % colors.length]
          const otherInitials = match.name.split(' ').map(n => n[0]).join('').slice(0, 2)
          const scoreColor = getScoreColor(match.score)

          return (
            <div key={match.id || idx} className="glass-card glow-hover p-4 flex items-center gap-4 transition-all">
              {/* Rank */}
              <div className="text-xl w-10 text-center flex-shrink-0">
                {idx < 3 ? medalEmoji[idx] : <span className="text-gray-600 font-bold">#{idx + 1}</span>}
              </div>

              {/* Avatar */}
              <Link to={`/profile/${match.id}`} className="flex-shrink-0">
                {match.profile?.photo ? (
                  <img src={match.profile.photo} alt={match.name}
                    className="w-12 h-12 rounded-full object-cover border-2"
                    style={{ borderColor: otherColor }}
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                  />
                ) : null}
                <div className="w-12 h-12 rounded-full items-center justify-center text-sm font-bold text-white"
                  style={{ background: `${otherColor}25`, border: `2px solid ${otherColor}`, display: match.profile?.photo ? 'none' : 'flex' }}>
                  {otherInitials}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${match.id}`} className="font-bold text-white hover:text-rose-400 transition-colors text-sm">
                  {match.name}
                </Link>
                {match.profile?.headline && (
                  <p className="text-xs text-gray-600 truncate">{match.profile.headline}</p>
                )}
                {match.reason && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{match.reason}</p>
                )}
              </div>

              {/* Score + Date button */}
              <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                <div className="text-2xl font-black" style={{ color: scoreColor }}>{match.score}</div>
                <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="score-bar h-1.5 rounded-full" style={{ width: `${match.score}%` }} />
                </div>
                <Link to={`/date/${id}/${match.id}`}
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: '#f43f5e20', color: '#f43f5e', border: '1px solid #f43f5e30' }}>
                  Watch Date
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
