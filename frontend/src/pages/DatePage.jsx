import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import { simulateAgenticDate } from '../utils/agentEngine'

const TIMELINE_STAGES = [
  { id: '01', title: 'INTRO', desc: 'First Impressions' },
  { id: '02', title: 'INTERESTS', desc: 'Craft & Curiosity' },
  { id: '03', title: 'VALUES', desc: 'Moral Axioms' },
  { id: '04', title: 'LIFESTYLE', desc: 'Daily Rhythm' },
  { id: '05', title: 'FUTURE', desc: 'Dealbreakers' },
  { id: '06', title: 'DECISION', desc: 'Mutual Verdict' }
]

export default function DatePage() {
  const { id1, id2 } = useParams()
  const [personA, setPersonA] = useState(null)
  const [personB, setPersonB] = useState(null)
  const [dateData, setDateData] = useState(null)
  const [currentTurn, setCurrentTurn] = useState(-1)
  const [activeSpeaker, setActiveSpeaker] = useState(null) // 'A' | 'B' | null
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const [isDating, setIsDating] = useState(false)
  const [dateCompleted, setDateCompleted] = useState(false)
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [activeSignal, setActiveSignal] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/matches.json').then(r => r.json()).catch(() => null),
    ]).then(([analyzed, matchData]) => {
      const added = JSON.parse(localStorage.getItem('added_people') || '[]')
      const all = [...added, ...analyzed]
      const pA = all.find(p => String(p.id) === String(id1))
      const pB = all.find(p => String(p.id) === String(id2))
      setPersonA(pA)
      setPersonB(pB)

      if (pA && pB) {
        const existing = matchData?.[id1]?.[id2]
        if (existing && existing.rounds) {
          setDateData(existing)
        } else {
          setDateData(simulateAgenticDate(pA, pB))
        }
      }
    }).catch(console.error)
  }, [id1, id2])

  const startCinematicDate = () => {
    if (isDating || !dateData) return
    setIsDating(true)
    setDateCompleted(false)
    setDisplayedMessages([])
    setCurrentTurn(-1)
    setActiveStageIdx(0)

    const allTurns = []
    dateData.rounds.forEach(r => {
      r.dialogue.forEach(d => allTurns.push(d))
    })

    const signalMap = [
      ['Intellectual Craft', 'Daily Pacing'],
      ['Autonomy Threshold', 'Creative Drive'],
      ['Personal Time', 'Independence'],
      ['Moral Candor', 'Conflict Purity'],
      ['Dealbreaker Zero-Tolerance', 'Radical Honesty'],
      ['Mutual Synthesis', 'Chemistry Established']
    ]

    allTurns.forEach((turn, idx) => {
      setTimeout(() => {
        setCurrentTurn(idx)
        setActiveSpeaker(turn.agent || (turn.speaker === 'A' ? 'A' : 'B'))
        setActiveStageIdx(Math.min(5, Math.floor((idx / allTurns.length) * 6)))
        setActiveSignal(signalMap[idx] || ['High Resonance', 'Aligned Axioms'])
        setDisplayedMessages(prev => [...prev, turn])

        if (idx === allTurns.length - 1) {
          setTimeout(() => {
            setActiveSpeaker(null)
            setIsDating(false)
            setDateCompleted(true)
            setActiveStageIdx(5)
          }, 2400)
        }
      }, idx * 2600)
    })
  }

  if (!personA || !personB) return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center font-mono text-xs text-slate-500">
      Loading Dating Chamber...
    </div>
  )

  const score = dateData?.compatibilityScore || 92
  const currentMessage = displayedMessages[displayedMessages.length - 1]

  return (
    <div className="relative min-h-screen bg-[#05050a] text-white overflow-hidden flex flex-col justify-between selection:bg-rose-500/30">
      {/* Background Cosmic Atmosphere */}
      <div className="absolute inset-0 bg-cosmic-grid pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-30 px-6 py-6 flex items-center justify-between border-b border-white/[0.06]">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>EXIT CHAMBER</span>
        </Link>

        <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>VIRTUAL DATING ENCOUNTER</span>
        </div>

        <div className="font-mono text-xs text-slate-400">
          CHAMBER #01 · PRIVATE SALON
        </div>
      </header>

      {/* Main Dating Room Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full py-8">
        {/* The Two Agent Orbs Header */}
        <div className="w-full flex items-center justify-between mb-8">
          {/* Agent A Orb */}
          <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 rounded-full p-1 transition-all duration-500 ${
              activeSpeaker === 'A'
                ? 'scale-115 ring-4 ring-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.7)]'
                : 'ring-1 ring-white/20'
            }`}>
              <img
                src={personA.photo}
                alt={personA.name}
                className="w-full h-full rounded-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-rose-600 font-mono text-[9px] uppercase font-bold tracking-widest">
                AGENT A
              </div>
            </div>
            <div className="font-bold text-sm text-white mt-3">{personA.name}</div>
            <div className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">{personA.headline}</div>
          </div>

          {/* Dynamic Glowing Beam between them */}
          <div className="flex-1 mx-8 relative flex items-center justify-center h-24">
            <div className={`w-full h-[2px] transition-all duration-500 ${
              isDating
                ? 'bg-gradient-to-r from-rose-500 via-pink-400 to-sky-400 shadow-[0_0_20px_#f43f5e]'
                : dateCompleted
                ? 'bg-gradient-to-r from-rose-500 to-emerald-400 shadow-[0_0_30px_#10b981] h-[3px]'
                : 'bg-white/10'
            }`} />

            {/* Pulsing center node */}
            <div className="absolute w-8 h-8 rounded-full glass-panel flex items-center justify-center border border-white/20">
              <span className={`w-3 h-3 rounded-full transition-all ${
                isDating ? 'bg-rose-500 animate-ping' : dateCompleted ? 'bg-emerald-400' : 'bg-white/30'
              }`} />
            </div>
          </div>

          {/* Agent B Orb */}
          <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 rounded-full p-1 transition-all duration-500 ${
              activeSpeaker === 'B'
                ? 'scale-115 ring-4 ring-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.7)]'
                : 'ring-1 ring-white/20'
            }`}>
              <img
                src={personB.photo}
                alt={personB.name}
                className="w-full h-full rounded-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-sky-600 font-mono text-[9px] uppercase font-bold tracking-widest">
                AGENT B
              </div>
            </div>
            <div className="font-bold text-sm text-white mt-3">{personB.name}</div>
            <div className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">{personB.headline}</div>
          </div>
        </div>

        {/* Center Conversation / Stage Terminal */}
        <div className="w-full max-w-2xl min-h-[220px] flex flex-col justify-center text-center">
          {!isDating && !dateCompleted && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight">Ready to initiate encounter?</h2>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed font-light">
                Both agents are primed with their human's psychological vectors. They will conduct an autonomous 6-stage dialogue.
              </p>
              <button
                onClick={startCinematicDate}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                INITIATE AGENT ENCOUNTER →
              </button>
            </div>
          )}

          {isDating && currentMessage && (
            <div className="space-y-4 animate-fade-in">
              <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                SPEAKING: <span className={activeSpeaker === 'A' ? 'text-rose-400 font-bold' : 'text-sky-400 font-bold'}>
                  {activeSpeaker === 'A' ? `AGENT ${personA.name}` : `AGENT ${personB.name}`}
                </span>
              </div>

              <blockquote className="text-lg sm:text-2xl text-white font-light italic leading-relaxed px-4">
                "{currentMessage.message}"
              </blockquote>

              {activeSignal && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">AI COMPATIBILITY SIGNALS:</span>
                  {activeSignal.map((s, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-rose-300 border border-white/[0.1]">
                      ✦ {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FINAL MATCH RESULT POPUP */}
          {dateCompleted && (
            <div className="glass-panel-glow p-8 rounded-3xl border border-rose-500/40 text-center space-y-6 animate-fade-in max-w-xl mx-auto shadow-2xl">
              <div className="font-mono text-xs uppercase tracking-widest text-rose-400 font-bold">
                ENCOUNTER COMPLETED
              </div>

              <div className="text-6xl sm:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400">
                {score}%
              </div>

              <div className="text-lg font-bold text-white uppercase tracking-wider">
                MATCH CONFIRMED
              </div>

              <p className="text-xs text-slate-300 italic max-w-md mx-auto leading-relaxed">
                "Both agents agree that mutual ambition and sovereign autonomy make this an extraordinary potential union."
              </p>

              <div className="grid grid-cols-2 gap-3 text-left font-mono text-[11px] pt-2 border-t border-white/[0.08]">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-rose-400 font-bold mb-1">WHY IT WORKS</div>
                  <div className="text-slate-300 text-[10px] space-y-1">
                    <div>• Aligned lifestyle autonomy</div>
                    <div>• High creative stamina</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-amber-400 font-bold mb-1">POTENTIAL FRICTION</div>
                  <div className="text-slate-300 text-[10px] space-y-1">
                    <div>• Demanding work schedules</div>
                    <div>• Needs calendar discipline</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  to={`/profile/${personA.id}`}
                  className="px-5 py-2.5 rounded-full bg-white/[0.1] hover:bg-white/[0.2] font-mono text-xs text-white uppercase"
                >
                  VIEW PROFILE
                </Link>
                <Link
                  to={`/rankings/${personA.id}`}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 font-mono text-xs font-bold text-white uppercase"
                >
                  SEE RANKINGS →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Live Date Timeline at Bottom */}
      <footer className="relative z-30 px-6 py-5 border-t border-white/[0.06] bg-[#05050a]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          {TIMELINE_STAGES.map((stg, idx) => {
            const isCompleted = idx < activeStageIdx || dateCompleted
            const isActive = idx === activeStageIdx && isDating

            return (
              <div key={stg.id} className="flex items-center gap-2 text-left min-w-[90px]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e]'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/[0.05] text-slate-500 border border-white/[0.08]'
                }`}>
                  {isCompleted ? '✓' : stg.id}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-[10px] font-mono font-bold ${isActive ? 'text-rose-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                    {stg.title}
                  </div>
                  <div className="text-[9px] text-slate-500">{stg.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </footer>
    </div>
  )
}
