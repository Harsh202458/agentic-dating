import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ChevronLeft, Zap } from 'lucide-react'

export default function DatePage() {
  const { id1, id2 } = useParams()
  const [people, setPeople] = useState([])
  const [matches, setMatches] = useState(null)
  const [personA, setPersonA] = useState(null)
  const [personB, setPersonB] = useState(null)
  const [conversation, setConversation] = useState([])
  const [displayedMsgs, setDisplayedMsgs] = useState([])
  const [score, setScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/profiles_analyzed.json').then(r => r.json()),
      fetch('/data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, matchData]) => {
      setPeople(analyzed)
      const pA = analyzed.find(p => String(p.id) === String(id1))
      const pB = analyzed.find(p => String(p.id) === String(id2))
      setPersonA(pA)
      setPersonB(pB)

      if (matchData && matchData[id1] && matchData[id1][id2]) {
        const m = matchData[id1][id2]
        setConversation(m.conversation || [])
        setScore(m.compatibilityScore)
        setMatches(matchData[id1][id2])
      } else {
        // Generate fallback convo from profiles
        if (pA && pB) {
          setConversation([
            { agent: 'A', name: pA.name, message: `Hi! I'm representing ${pA.name}. I see you're also passionate about ${pB.interests?.[0] || 'interesting things'}?` },
            { agent: 'B', name: pB.name, message: `Yes! And from what I know about ${pA.name}, we might have more in common — especially around ${pA.hobbies?.[0] || 'building things'}.` },
            { agent: 'A', name: pA.name, message: `Totally. ${pA.name} values ${pA.values?.[0] || 'authenticity'} above all. What about ${pB.name}?` },
            { agent: 'B', name: pB.name, message: `${pB.name} cares deeply about ${pB.values?.[0] || 'impact'}. That actually aligns really well.` },
            { agent: 'A', name: pA.name, message: `I like that. One thing — ${pA.name} is a ${pA.personality?.[0] || 'driven'} person. Can ${pB.name} keep up?` },
            { agent: 'B', name: pB.name, message: `${pB.name} is ${pB.personality?.[0] || 'equally ambitious'}. Challenge accepted.` },
          ])
          setScore(Math.floor(55 + Math.random() * 35))
        }
      }
    }).catch(console.error)
  }, [id1, id2])

  const playConversation = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setDisplayedMsgs([])
    setShowScore(false)

    conversation.forEach((msg, i) => {
      setTimeout(() => {
        setDisplayedMsgs(prev => [...prev, msg])
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
        if (i === conversation.length - 1) {
          setTimeout(() => { setShowScore(true); setIsPlaying(false) }, 1000)
        }
      }, i * 1800)
    })
  }

  if (!personA || !personB) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Heart className="heartbeat" style={{ color: '#f43f5e' }} size={48} fill="#f43f5e" />
    </div>
  )

  const colorA = '#f43f5e'
  const colorB = '#c026d3'
  const initialsA = personA.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const initialsB = personB.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const getScoreLabel = (s) => {
    if (s >= 85) return { label: '💘 Soulmate Material', color: '#f43f5e' }
    if (s >= 70) return { label: '🔥 Strong Connection', color: '#c026d3' }
    if (s >= 55) return { label: '✨ Good Match', color: '#7c3aed' }
    if (s >= 40) return { label: '🤔 Could Work', color: '#2563eb' }
    return { label: '🌱 Growing', color: '#059669' }
  }

  const scoreInfo = getScoreLabel(score || 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-gray-500 hover:text-rose-400 mb-6 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Back
      </Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 flex items-center justify-center gap-1">
          <Zap size={12} /> Agent Date Simulation
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <PersonAvatar person={personA} color={colorA} initials={initialsA} size="md" />
          <div className="text-center">
            <Heart className="heartbeat mx-auto mb-1" fill={colorA} style={{ color: colorA }} size={28} />
            <span className="text-xs text-gray-500">×</span>
          </div>
          <PersonAvatar person={personB} color={colorB} initials={initialsB} size="md" />
        </div>
        <h1 className="text-xl font-bold text-white">
          {personA.name} <span style={{ color: colorA }}>✦</span> {personB.name}
        </h1>
      </div>

      {/* Select other people to date */}
      <div className="glass-card p-4 mb-6">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Change Partner</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-600 mb-2">Person A</p>
            <Link to={`/rankings/${personB.id}`} className="text-xs text-rose-400 hover:underline block">→ See {personA.name}'s full rankings</Link>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-2">Person B</p>
            <Link to={`/rankings/${personB.id}`} className="text-xs text-rose-400 hover:underline block">→ See {personB.name}'s full rankings</Link>
          </div>
        </div>
      </div>

      {/* Play button */}
      {displayedMsgs.length === 0 && !isPlaying && (
        <div className="text-center mb-6">
          <button
            onClick={playConversation}
            className="px-8 py-3 rounded-full font-bold text-white text-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #c026d3)' }}>
            ▶ Watch Agents Date
          </button>
          <p className="text-gray-600 text-xs mt-2">Simulated by AI agents on behalf of real people</p>
        </div>
      )}

      {/* Chat */}
      {(displayedMsgs.length > 0 || isPlaying) && (
        <div className="glass-card p-6 mb-6">
          <div ref={chatRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {displayedMsgs.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.agent === 'B' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <PersonAvatar
                    person={msg.agent === 'A' ? personA : personB}
                    color={msg.agent === 'A' ? colorA : colorB}
                    initials={msg.agent === 'A' ? initialsA : initialsB}
                    size="sm"
                  />
                </div>
                <div className={`max-w-[75%] ${msg.agent === 'A' ? 'bubble-a' : 'bubble-b'} p-3`}>
                  <p className="text-xs font-bold mb-1" style={{ color: msg.agent === 'A' ? colorA : colorB }}>
                    {msg.name}'s Agent
                  </p>
                  <p className="text-sm text-gray-200">{msg.message}</p>
                </div>
              </div>
            ))}
            {isPlaying && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                <span className="text-xs ml-2">Agents are talking...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Score reveal */}
      {showScore && score !== null && (
        <div className="glass-card p-8 text-center" style={{ border: `1px solid ${scoreInfo.color}40` }}>
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Compatibility Score</p>
          <div className="text-7xl font-black mb-2" style={{ color: scoreInfo.color }}>
            {score}<span className="text-3xl text-gray-500">/100</span>
          </div>
          <p className="text-xl font-bold mb-4" style={{ color: scoreInfo.color }}>{scoreInfo.label}</p>
          <div className="h-3 rounded-full mb-4 mx-auto max-w-xs" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="score-bar h-3" style={{ width: `${score}%` }} />
          </div>
          {matches?.matchReason && (
            <p className="text-gray-400 text-sm mb-4">{matches.matchReason}</p>
          )}
          {matches?.sparks?.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {matches.sparks.map(s => (
                <span key={s} className="text-xs px-3 py-1 rounded-full" style={{ background: '#f43f5e20', color: '#f43f5e', border: '1px solid #f43f5e30' }}>⚡ {s}</span>
              ))}
            </div>
          )}
          {matches?.tensions?.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {matches.tensions.map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: '#dc262620', color: '#dc2626', border: '1px solid #dc262630' }}>⚠ {t}</span>
              ))}
            </div>
          )}
          <button onClick={() => { setDisplayedMsgs([]); setShowScore(false); setTimeout(playConversation, 300) }}
            className="mt-6 px-6 py-2 rounded-full text-sm font-semibold text-gray-400 border border-gray-700 hover:border-rose-500 hover:text-rose-400 transition-all">
            ↺ Replay
          </button>
        </div>
      )}
    </div>
  )
}

function PersonAvatar({ person, color, initials, size = 'md' }) {
  const dim = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-xl'
  return (
    <div className="text-center">
      {person.photo ? (
        <img src={person.photo} alt={person.name}
          className={`${dim} rounded-full object-cover border-2 mx-auto`}
          style={{ borderColor: color }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
        />
      ) : null}
      <div className={`${dim} rounded-full items-center justify-center font-bold text-white mx-auto`}
        style={{ background: `${color}25`, border: `2px solid ${color}`, display: person.photo ? 'none' : 'flex' }}>
        {initials}
      </div>
      {size !== 'sm' && <p className="text-xs text-gray-500 mt-1 max-w-[80px] truncate">{person.name}</p>}
    </div>
  )
}
