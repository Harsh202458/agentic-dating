import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Heart, Sparkles, AlertTriangle, ArrowRight, MapPin } from 'lucide-react'

const VENUES = [
  { id: 'coffee', name: 'Quiet Coffee Shop', vibe: 'Low pressure, natural conversation' },
  { id: 'dinner', name: 'Casual Dinner & Drinks', vibe: 'Intimate evening, deep questions' },
  { id: 'walk', name: 'Walk in the Park', vibe: 'Active, open air, spontaneous' },
]

export default function DatePage() {
  const { id1, id2 } = useParams()
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
  const [chemistryProgress, setChemistryProgress] = useState(15)
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
          { agent: 'A', name: pA.name, message: `Hi! I've been reviewing ${pB.name}'s background. Your focus on ${pB.interests?.[0] || 'your work'} really resonated with us.` },
          { agent: 'B', name: pB.name, message: `Nice to meet you! From what we see about ${pA.name}, you value ${pA.values?.[0] || 'authenticity'} and doing things your own way.` },
          { agent: 'A', name: pA.name, message: `Definitely. A non-negotiable for ${pA.name} is ${pA.needs?.[0] || 'independence'}. How does ${pB.name} handle balancing high ambition with relationship time?` },
          { agent: 'B', name: pB.name, message: `By having dedicated rituals around ${pB.hobbies?.[0] || 'daily life'}. When both people respect each other's drive, it works naturally.` },
          { agent: 'A', name: pA.name, message: `That makes a lot of sense. Sounds like our daily rhythms and core values line up remarkably well.` },
          { agent: 'B', name: pB.name, message: `Agreed. I think our chemistry on paper and in conversation is very strong.` },
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
    setChemistryProgress(15)

    conversation.forEach((msg, i) => {
      setTimeout(() => {
        setDisplayedMsgs(prev => [...prev, msg])
        const pct = Math.round(15 + ((i + 1) / conversation.length) * ((score || 78) - 15))
        setChemistryProgress(pct)

        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }

        if (i === conversation.length - 1) {
          setTimeout(() => {
            setShowScore(true)
            setIsPlaying(false)
            setChemistryProgress(score || 78)
          }, 800)
        }
      }, i * 1500)
    })
  }

  if (!personA || !personB) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-medium text-slate-500">Setting up date simulation...</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Back to all people</span>
      </Link>

      {/* Main Date Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Heart size={14} fill="currentColor" />
            <span>Agent Dating Simulation</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={13} />
            <span>Setting:</span>
            <select
              value={venue.id}
              onChange={e => setVenue(VENUES.find(v => v.id === e.target.value) || VENUES[0])}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-900 outline-none"
            >
              {VENUES.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Both people head-to-head */}
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* Person A */}
          <div className="flex items-center gap-3.5">
            <img
              src={personA.photo}
              alt={personA.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shadow-sm"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-full items-center justify-center font-bold text-xl text-rose-600 bg-rose-50 border-2 border-rose-200 shadow-sm" style={{ display: personA.photo ? 'none' : 'flex' }}>
              {personA.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">{personA.name}</div>
              <div className="text-xs text-rose-600 font-semibold">{personA.name}'s Agent</div>
            </div>
          </div>

          {/* Person B */}
          <div className="flex items-center justify-end gap-3.5 text-right">
            <div>
              <div className="font-bold text-sm text-slate-900">{personB.name}</div>
              <div className="text-xs text-sky-600 font-semibold">{personB.name}'s Agent</div>
            </div>
            <img
              src={personB.photo}
              alt={personB.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-sky-200 shadow-sm"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-full items-center justify-center font-bold text-xl text-sky-600 bg-sky-50 border-2 border-sky-200 shadow-sm" style={{ display: personB.photo ? 'none' : 'flex' }}>
              {personB.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Live Chemistry Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Simulated Chemistry Score</span>
            <span className="text-rose-600 font-bold">{chemistryProgress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full transition-all duration-300"
              style={{ width: `${chemistryProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Start Button when idle */}
      {displayedMsgs.length === 0 && !isPlaying && (
        <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Watch the Date Happen</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            The two agents will converse in character, discussing their lifestyle needs, career focus, and values.
          </p>
          <button
            onClick={playConversation}
            className="px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Start Date Conversation
          </button>
        </div>
      )}

      {/* Live Conversation Window */}
      {(displayedMsgs.length > 0 || isPlaying) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5 text-xs">
            <span className="font-bold text-slate-700">Live Dialogue</span>
            {isPlaying && (
              <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Agents Talking...</span>
              </span>
            )}
          </div>

          <div ref={transcriptRef} className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {displayedMsgs.map((msg, idx) => {
              const isA = msg.agent === 'A'
              return (
                <div key={idx} className={`p-4 ${isA ? 'chat-bubble-a' : 'chat-bubble-b'}`}>
                  <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                    <span className={isA ? 'text-rose-600' : 'text-sky-600'}>
                      {isA ? `${personA.name}'s Agent` : `${personB.name}'s Agent`}
                    </span>
                    <span className="text-slate-400 font-normal">Turn {idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              )
            })}

            {isPlaying && (
              <div className="text-xs text-slate-400 italic pl-3 py-1">
                ... preparing response ...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Date Assessment */}
      {showScore && score !== null && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                Date Completed
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Compatibility Result
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-semibold text-slate-400">Match Score</div>
              <div className="text-4xl font-extrabold text-rose-600 mt-0.5">
                {score} <span className="text-base text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Why They Fit
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {matches?.matchReason || `${personA.name} and ${personB.name} have exceptional synergy in how they structure their lives and approach their long-term missions.`}
            </p>
          </div>

          {/* Sparks and Friction Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-2">
                <Sparkles size={14} />
                <span>Shared Sparks</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(matches?.sparks || [
                  'Mutual appreciation for high-agency living',
                  'Shared focus on deep, authentic communication',
                ]).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-2">
                <AlertTriangle size={14} />
                <span>Things to Watch Out For</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(matches?.tensions || [
                  'Both have demanding travel and work commitments',
                  'Need proactive scheduling to ensure regular quality time',
                ]).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <button
              onClick={() => {
                setDisplayedMsgs([])
                setShowScore(false)
                setTimeout(playConversation, 150)
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Replay Date</span>
            </button>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link to={`/rankings/${personA.id}`} className="text-rose-600 hover:underline">
                See {personA.name}'s Rankings →
              </Link>
              <Link to={`/rankings/${personB.id}`} className="text-sky-600 hover:underline">
                See {personB.name}'s Rankings →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
