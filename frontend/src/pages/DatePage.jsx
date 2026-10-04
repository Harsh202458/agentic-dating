import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Sparkles, AlertTriangle, ArrowUpRight, MapPin, Heart } from 'lucide-react'

const VENUES = [
  { id: 'jazz', name: 'Private Jazz Mezzanine, Manhattan', vibe: 'Intimate, late night, low lighting' },
  { id: 'coffee', name: 'Artisanal Roastery, Tokyo', vibe: 'Minimalist, morning sunlight, slow pace' },
  { id: 'walk', name: 'Embarcadero Waterfront, San Francisco', vibe: 'Breezy, open air, spontaneous' },
  { id: 'bistro', name: 'Historic Wine Cellar, Paris', vibe: 'Candlelit, rich conversation, deep debate' }
]

export default function DatePage() {
  const { id1, id2 } = useParams()
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [matches, setMatches] = useState(null)
  const [personA, setPersonA] = useState(null)
  const [personB, setPersonB] = useState(null)
  const [venue, setVenue] = useState(VENUES[0])
  const [conversation, setConversation] = useState([])
  const [displayedMsgs, setDisplayedMsgs] = useState([])
  const [score, setScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [chemistryProgress, setChemistryProgress] = useState(25)
  const transcriptRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
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
      } else if (pA && pB) {
        setConversation([
          { agent: 'A', name: pA.name, message: `I've been analyzing ${pB.name}'s lifestyle graph. Your dedication to ${pB.interests?.[0] || 'your craft'} caught my attention right away.` },
          { agent: 'B', name: pB.name, message: `Thank you. From what I observe about ${pA.name}, there's an uncompromising pursuit of ${pA.values?.[0] || 'truth'}. That's rare to encounter.` },
          { agent: 'A', name: pA.name, message: `For ${pA.name}, a core need is ${pA.needs?.[0] || 'unhurried freedom'}. How does ${pB.name} maintain personal presence while navigating high stakes?` },
          { agent: 'B', name: pB.name, message: `Through strict boundaries around ${pB.hobbies?.[0] || 'daily rituals'}. When both partners respect that devotion, independence becomes magnetic.` },
          { agent: 'A', name: pA.name, message: `That's an ideal alignment. If we shared an evening together, would it be an intense intellectual debate or an adventurous escape?` },
          { agent: 'B', name: pB.name, message: `We begin with high-octane banter, then let the conversation drift until 2 AM. I believe our chemistry is undeniable.` },
        ])
        setScore(78)
      }
    }).catch(console.error)
  }, [id1, id2])

  const playConversation = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setDisplayedMsgs([])
    setShowScore(false)
    setChemistryProgress(20)

    conversation.forEach((msg, i) => {
      setTimeout(() => {
        setDisplayedMsgs(prev => [...prev, msg])
        const pct = Math.round(20 + ((i + 1) / conversation.length) * ((score || 78) - 20))
        setChemistryProgress(pct)

        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }

        if (i === conversation.length - 1) {
          setTimeout(() => {
            setShowScore(true)
            setIsPlaying(false)
            setChemistryProgress(score || 78)
          }, 1000)
        }
      }, i * 1600)
    })
  }

  if (!personA || !personB) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">Preparing Date Arena...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Return to All Subjects</span>
      </Link>

      {/* Arena Stage Card */}
      <div className="aura-card p-6 md:p-8 mb-8 bg-[#101726] border border-white/[0.1]">
        {/* Top telemetry and venue selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>AUTONOMOUS COURTSHIP SIMULATION</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-slate-400" />
            <select
              value={venue.id}
              onChange={e => setVenue(VENUES.find(v => v.id === e.target.value) || VENUES[0])}
              className="bg-slate-900 border border-white/[0.1] rounded px-3 py-1 font-mono text-xs text-white outline-none cursor-pointer"
            >
              {VENUES.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* The Two Subjects Face-off Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Subject A */}
          <div className="md:col-span-5 flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/[0.06]">
            <img
              src={personA.photo}
              alt={personA.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-rose-500/50"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-xl items-center justify-center font-bold text-2xl text-rose-400 bg-slate-800" style={{ display: personA.photo ? 'none' : 'flex' }}>
              {personA.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base text-white truncate">{personA.name}</div>
              <div className="font-mono text-[11px] text-rose-400">Agent Proxy A</div>
              <div className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">{personA.headline}</div>
            </div>
          </div>

          {/* Versus Icon */}
          <div className="md:col-span-1 text-center font-mono font-bold text-slate-600 text-sm">
            VS
          </div>

          {/* Subject B */}
          <div className="md:col-span-5 flex items-center justify-end gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/[0.06] text-right">
            <div className="min-w-0">
              <div className="font-bold text-base text-white truncate">{personB.name}</div>
              <div className="font-mono text-[11px] text-sky-400">Agent Proxy B</div>
              <div className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">{personB.headline}</div>
            </div>
            <img
              src={personB.photo}
              alt={personB.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-sky-500/50"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-xl items-center justify-center font-bold text-2xl text-sky-400 bg-slate-800" style={{ display: personB.photo ? 'none' : 'flex' }}>
              {personB.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Live Chemistry Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <div className="flex justify-between items-center font-mono text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Heart size={13} className="text-rose-400" />
              <span>Real-Time Chemistry Gauge</span>
            </span>
            <span className="font-bold text-white">{chemistryProgress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${chemistryProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Start Button when not playing */}
      {displayedMsgs.length === 0 && !isPlaying && (
        <div className="text-center py-12 bg-slate-900/70 border border-dashed border-white/[0.1] rounded-2xl mb-8 p-6">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Play size={22} fill="currentColor" className="ml-1" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Watch Agents Date</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Both autonomous agents will begin an unscripted date at the <span className="text-white font-medium">{venue.name}</span>, probing mutual values and lifestyle harmony.
          </p>
          <button
            onClick={playConversation}
            className="font-mono text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-lg shadow-rose-500/30 cursor-pointer"
          >
            Start Live Date Simulation
          </button>
        </div>
      )}

      {/* Live Conversation Transcript Window */}
      {(displayedMsgs.length > 0 || isPlaying) && (
        <div className="aura-card p-6 md:p-8 bg-[#101726] border border-white/[0.1] mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 font-mono text-xs">
            <span className="text-slate-400 font-semibold uppercase">Date Dialogue Transcript</span>
            {isPlaying && (
              <span className="flex items-center gap-2 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Simulating Turn-by-Turn</span>
              </span>
            )}
          </div>

          <div ref={transcriptRef} className="space-y-5 max-h-[500px] overflow-y-auto pr-3">
            {displayedMsgs.map((msg, idx) => {
              const isA = msg.agent === 'A'
              return (
                <div key={idx} className={`p-4 ${isA ? 'dialogue-bubble-a' : 'dialogue-bubble-b'}`}>
                  <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                    <span className={isA ? 'text-rose-400 font-bold' : 'text-sky-400 font-bold'}>
                      {isA ? `${personA.name}'s Agent` : `${personB.name}'s Agent`}
                    </span>
                    <span className="text-slate-500 font-normal">Turn {idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-100 leading-relaxed font-normal">
                    {msg.message}
                  </p>
                </div>
              )
            })}

            {isPlaying && (
              <div className="flex items-center gap-2 text-slate-500 font-mono text-xs py-2 pl-4">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                <span className="ml-2">Synthesizing next response...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Date Assessment Card */}
      {showScore && score !== null && (
        <div className="aura-card p-8 bg-[#101726] border-2 border-rose-500/40 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold mb-1">
                Post-Date Debrief & Analysis
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Compatibility Synthesis
              </h2>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs text-slate-400">Affinity Score</div>
              <div className="text-5xl font-black text-rose-400 font-mono mt-0.5">
                {score} <span className="text-lg text-slate-500 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Synthesis Reason */}
          <div className="space-y-1.5">
            <div className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
              Synergy Thesis
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {matches?.matchReason || `${personA.name} and ${personB.name} exhibit high complementarity in their creative stamina and mutual appetite for independent growth.`}
            </p>
          </div>

          {/* Sparks and Friction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/[0.04]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 mb-2">
                <Sparkles size={14} />
                <span>Catalytic Sparks</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(matches?.sparks || [
                  'Shared devotion to self-directed high agency',
                  'Mutual appreciation for intellectual depth over superficiality',
                ]).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-mono">✦</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/[0.04]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 mb-2">
                <AlertTriangle size={14} />
                <span>Potential Friction Points</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(matches?.tensions || [
                  'High work travel cadence may constrain spontaneous quality time',
                  'Differing communication paces requiring proactive alignment',
                ]).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-mono">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
            <button
              onClick={() => {
                setDisplayedMsgs([])
                setShowScore(false)
                setTimeout(playConversation, 200)
              }}
              className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Replay Date</span>
            </button>

            <div className="flex items-center gap-4 font-mono text-xs">
              <Link
                to={`/rankings/${personA.id}`}
                className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{personA.name}'s Full Rankings</span>
                <ArrowUpRight size={13} />
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                to={`/rankings/${personB.id}`}
                className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{personB.name}'s Full Rankings</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
