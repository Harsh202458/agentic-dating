import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Heart, Sparkles, AlertTriangle, ArrowRight, MapPin, CheckCircle2, Brain } from 'lucide-react'
import { simulateAgenticDate } from '../utils/agentEngine'

const VENUES = [
  { id: 'coffee', name: 'Quiet Neighborhood Cafe', vibe: 'Low pressure, natural conversation' },
  { id: 'dinner', name: 'Casual Bistro & Drinks', vibe: 'Intimate evening, deep values debate' },
  { id: 'walk', name: 'Open Air Waterfront Walk', vibe: 'Spontaneous, active cadence' },
]

export default function DatePage() {
  const { id1, id2 } = useParams()
  const [people, setPeople] = useState([])
  const [matches, setMatches] = useState(null)
  const [personA, setPersonA] = useState(null)
  const [personB, setPersonB] = useState(null)
  const [venue, setVenue] = useState(VENUES[0])
  const [dateData, setDateData] = useState(null)
  const [displayedRounds, setDisplayedRounds] = useState([])
  const [activeRoundIdx, setActiveRoundIdx] = useState(0)
  const [showVerdict, setShowVerdict] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentThought, setCurrentThought] = useState(null)
  const [chemistryProgress, setChemistryProgress] = useState(15)
  const transcriptRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, matchData]) => {
      const added = JSON.parse(localStorage.getItem('added_people') || '[]')
      const all = [...added, ...analyzed]
      setPeople(all)

      const pA = all.find(p => String(p.id) === String(id1))
      const pB = all.find(p => String(p.id) === String(id2))
      setPersonA(pA)
      setPersonB(pB)

      if (pA && pB) {
        // If precomputed exists in matchData, use it; otherwise generate live with agentEngine!
        const existing = matchData?.[id1]?.[id2]
        if (existing && existing.rounds) {
          setDateData(existing)
          setMatches(existing)
        } else {
          const sim = simulateAgenticDate(pA, pB, venue.name)
          setDateData(sim)
          setMatches(sim)
        }
      }
    }).catch(console.error)
  }, [id1, id2, venue.name])

  const playDateSimulation = () => {
    if (isPlaying || !dateData) return
    setIsPlaying(true)
    setDisplayedRounds([])
    setShowVerdict(false)
    setCurrentThought(null)
    setChemistryProgress(15)

    const rounds = dateData.rounds || []
    let delay = 0

    rounds.forEach((round, rIdx) => {
      round.dialogue.forEach((msg, mIdx) => {
        // Step 1: Agent Thinking
        setTimeout(() => {
          setCurrentThought({
            agent: msg.agent || (msg.speaker === 'A' ? 'A' : 'B'),
            name: msg.name || (msg.speaker === 'A' ? personA.name : personB.name),
            thought: msg.thought
          })
          if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }, delay)

        delay += 1400

        // Step 2: Agent Speaks Message
        setTimeout(() => {
          setCurrentThought(null)
          setDisplayedRounds(prev => {
            const next = [...prev]
            if (!next[rIdx]) next[rIdx] = { ...round, dialogue: [] }
            next[rIdx].dialogue.push(msg)
            return next
          })

          const totalTurns = rounds.length * 2
          const currentTurn = rIdx * 2 + mIdx + 1
          const pct = Math.round(15 + (currentTurn / totalTurns) * ((dateData.compatibilityScore || 80) - 15))
          setChemistryProgress(pct)

          if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }, delay)

        delay += 1800
      })
    })

    // Final reveal
    setTimeout(() => {
      setShowVerdict(true)
      setIsPlaying(false)
      setChemistryProgress(dateData.compatibilityScore || 80)
    }, delay + 500)
  }

  if (!personA || !personB) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-medium text-slate-500">Initializing Dating Room...</div>
    </div>
  )

  const score = dateData?.compatibilityScore || 78
  const factors = dateData?.breakdown?.factors || {}

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Back to all people</span>
      </Link>

      {/* Main Header Arena Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Heart size={14} fill="currentColor" />
            <span>Agentic Dating Room · Live Encounter</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={13} />
            <span>Venue:</span>
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

        {/* Head-to-Head Presenters */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Person A Agent */}
          <div className="md:col-span-5 flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={personA.photo}
              alt={personA.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shadow-sm"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-full items-center justify-center font-bold text-xl text-rose-600 bg-rose-50 border-2 border-rose-200" style={{ display: personA.photo ? 'none' : 'flex' }}>
              {personA.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-slate-900 truncate">{personA.name}</div>
              <div className="text-xs text-rose-600 font-bold">Agent Proxy A</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{personA.headline}</div>
            </div>
          </div>

          {/* Center VS */}
          <div className="md:col-span-1 text-center font-bold text-slate-400 text-xs">
            VS
          </div>

          {/* Person B Agent */}
          <div className="md:col-span-5 flex items-center justify-end gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <div className="min-w-0">
              <div className="font-bold text-sm text-slate-900 truncate">{personB.name}</div>
              <div className="text-xs text-sky-600 font-bold">Agent Proxy B</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{personB.headline}</div>
            </div>
            <img
              src={personB.photo}
              alt={personB.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-sky-200 shadow-sm"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-full items-center justify-center font-bold text-xl text-sky-600 bg-sky-50 border-2 border-sky-200" style={{ display: personB.photo ? 'none' : 'flex' }}>
              {personB.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Live Chemistry Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Real-Time Chemistry Gauge</span>
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
      {displayedRounds.length === 0 && !isPlaying && (
        <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Execute 3-Round Agent Date</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            Watch Agent {personA.name} and Agent {personB.name} exchange 3 structured rounds: Icebreaker, Ambition & Lifestyle, and Core Values & Dealbreakers.
          </p>
          <button
            onClick={playDateSimulation}
            className="px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Start Real Agent Date
          </button>
        </div>
      )}

      {/* Live Dating Transcript Window */}
      {(displayedRounds.length > 0 || isPlaying) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5 text-xs">
            <span className="font-bold text-slate-700">Dating Room Dialogue</span>
            {isPlaying && (
              <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Agents In Multi-Turn Dialogue...</span>
              </span>
            )}
          </div>

          <div ref={transcriptRef} className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {displayedRounds.map((round, rIdx) => (
              <div key={rIdx} className="space-y-3 pb-4 border-b border-slate-100 last:border-b-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-3 py-1 rounded-md inline-block">
                  {round.roundTitle}
                </div>

                {round.dialogue.map((msg, mIdx) => {
                  const isA = msg.agent === 'A' || msg.speaker === 'A'
                  return (
                    <div key={mIdx} className={`p-4 ${isA ? 'chat-bubble-a' : 'chat-bubble-b'}`}>
                      <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                        <span className={isA ? 'text-rose-600' : 'text-sky-600'}>
                          {isA ? `Agent ${personA.name}` : `Agent ${personB.name}`}
                        </span>
                        <span className="text-slate-400 font-normal">Turn {mIdx + 1}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {msg.message}
                      </p>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Visible Agent Thinking Indicator */}
            {currentThought && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
                <Brain size={16} className={currentThought.agent === 'A' ? 'text-rose-600 shrink-0' : 'text-sky-600 shrink-0'} />
                <div>
                  <div className="font-bold text-slate-800">
                    Agent {currentThought.name} is thinking...
                  </div>
                  <p className="text-slate-600 italic mt-0.5 leading-relaxed font-light">
                    "{currentThought.thought}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Date Assessment Card (7-Factor Weighted Breakdown + Independent Verdicts) */}
      {showVerdict && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                Post-Date Synthesis
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Independent Compatibility Evaluation
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-semibold text-slate-400">Total Weighted Score</div>
              <div className="text-4xl font-extrabold text-rose-600 mt-0.5">
                {score} <span className="text-base text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Synthesis Reason */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Explainable Compatibility Thesis
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dateData?.matchReason}
            </p>
          </div>

          {/* Independent Agent Verdicts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {/* Agent A Verdict */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-800">Agent {personA.name}'s Verdict</span>
                <span className="text-xs font-bold text-rose-600 font-mono">{dateData?.agentAVerdict?.score || score}/100</span>
              </div>
              <p className="text-xs text-slate-700 italic mb-2">
                {dateData?.agentAVerdict?.perspective}
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div><strong className="text-emerald-700">✓ Green flag:</strong> {dateData?.agentAVerdict?.greenFlags?.[0]}</div>
                <div><strong className="text-amber-700">⚠ Caution:</strong> {dateData?.agentAVerdict?.cautions?.[0]}</div>
              </div>
            </div>

            {/* Agent B Verdict */}
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-800">Agent {personB.name}'s Verdict</span>
                <span className="text-xs font-bold text-sky-600 font-mono">{dateData?.agentBVerdict?.score || score}/100</span>
              </div>
              <p className="text-xs text-slate-700 italic mb-2">
                {dateData?.agentBVerdict?.perspective}
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div><strong className="text-emerald-700">✓ Green flag:</strong> {dateData?.agentBVerdict?.greenFlags?.[0]}</div>
                <div><strong className="text-amber-700">⚠ Caution:</strong> {dateData?.agentBVerdict?.cautions?.[0]}</div>
              </div>
            </div>
          </div>

          {/* 7-Factor Weighted Breakdown Formula */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span>7-Factor Compatibility Weights Breakdown</span>
              <span className="text-slate-400 font-normal">Explicit Deterministic Formula</span>
            </div>
            <div className="space-y-2.5">
              {Object.entries(factors).map(([k, item]) => (
                <div key={k} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-600">{item.label} <span className="font-mono text-slate-400">({item.weight})</span></span>
                    <span className="font-bold text-slate-900 font-mono">{item.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <button
              onClick={() => {
                setDisplayedRounds([])
                setShowVerdict(false)
                setTimeout(playDateSimulation, 150)
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
