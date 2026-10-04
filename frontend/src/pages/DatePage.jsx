import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react'

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

    conversation.forEach((msg, i) => {
      setTimeout(() => {
        setDisplayedMsgs(prev => [...prev, msg])
        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }
        if (i === conversation.length - 1) {
          setTimeout(() => {
            setShowScore(true)
            setIsPlaying(false)
          }, 1200)
        }
      }, i * 1600)
    })
  }

  if (!personA || !personB) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="font-mono text-xs uppercase tracking-widest text-[#7a8190] mb-2">Simulating Pairing</div>
      <div className="font-serif italic text-2xl text-[#f2f0eb]">Calibrating agent personas...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-[#7a8190] hover:text-[#c89d7c] transition-colors mb-8">
        <ArrowLeft size={14} />
        <span>Return to Subject Index</span>
      </Link>

      {/* Screenplay Masthead */}
      <header className="border border-white/[0.08] bg-[#111318] rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#c89d7c] mb-1">
              PROTOCOL // AUTONOMOUS INTER-AGENT COURTSHIP
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#f2f0eb]">
              {personA.name} <span className="italic font-light text-[#c89d7c]">meets</span> {personB.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#7a8190] bg-[#161821] px-3 py-1 rounded border border-white/[0.05]">
              VENUE: PRIVATE CURATED SALON
            </span>
          </div>
        </div>

        {/* The Two Subjects Face-Off */}
        <div className="grid grid-cols-2 gap-6 pt-6">
          <div className="flex items-center gap-4">
            <img
              src={personA.photo}
              alt={personA.name}
              className="w-14 h-14 rounded-lg object-cover border border-[#c89d7c]/40"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-lg items-center justify-center font-serif italic text-2xl text-[#c89d7c] bg-[#161821]" style={{ display: personA.photo ? 'none' : 'flex' }}>
              {personA.name.charAt(0)}
            </div>
            <div>
              <div className="font-serif text-lg text-[#f2f0eb]">{personA.name}</div>
              <div className="font-mono text-[11px] text-[#8a91a0]">Agent Proxy A</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 text-right">
            <div>
              <div className="font-serif text-lg text-[#f2f0eb]">{personB.name}</div>
              <div className="font-mono text-[11px] text-[#8a91a0]">Agent Proxy B</div>
            </div>
            <img
              src={personB.photo}
              alt={personB.name}
              className="w-14 h-14 rounded-lg object-cover border border-[#d46853]/40"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="w-14 h-14 rounded-lg items-center justify-center font-serif italic text-2xl text-[#d46853] bg-[#161821]" style={{ display: personB.photo ? 'none' : 'flex' }}>
              {personB.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Play Controller */}
      {displayedMsgs.length === 0 && !isPlaying && (
        <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-xl bg-[#0e1015] mb-8">
          <p className="font-serif italic text-2xl text-[#f2f0eb] mb-2">Ready to initiate the encounter</p>
          <p className="font-mono text-xs text-[#7a8190] max-w-md mx-auto mb-6">
            Both autonomous agents will converse, probe core values, and discover whether their synthesized lifestyles harmonize.
          </p>
          <button
            onClick={playConversation}
            className="font-mono text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded bg-[#f2f0eb] text-[#090a0d] hover:bg-[#c89d7c] transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Play size={14} fill="currentColor" />
            <span>Execute Courtship Dialogue</span>
          </button>
        </div>
      )}

      {/* Screenplay Transcript Window */}
      {(displayedMsgs.length > 0 || isPlaying) && (
        <div className="bg-[#111318] border border-white/[0.08] rounded-xl p-8 mb-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a8190] pb-4 border-b border-white/[0.06] mb-6 flex items-center justify-between">
            <span>TRANSCRIPT RECORD // LIVE ENCOUNTER FEED</span>
            {isPlaying && (
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AGENTS TRANSMITTING</span>
              </span>
            )}
          </div>

          <div ref={transcriptRef} className="space-y-6 max-h-[520px] overflow-y-auto pr-3">
            {displayedMsgs.map((msg, i) => {
              const isA = msg.agent === 'A'
              return (
                <div key={i} className={`p-4 ${isA ? 'transcript-line-a' : 'transcript-line-b'}`}>
                  <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                    <span className={isA ? 'text-[#c89d7c] font-medium' : 'text-[#d46853] font-medium'}>
                      {isA ? `AGENT // ${personA.name}` : `AGENT // ${personB.name}`}
                    </span>
                    <span className="text-[#5e6472]">T+{String(i * 12 + 4).padStart(2, '0')}m</span>
                  </div>
                  <p className="font-sans text-sm text-[#e2e0d8] leading-relaxed font-light">
                    {msg.message}
                  </p>
                </div>
              )
            })}

            {isPlaying && (
              <div className="font-mono text-xs text-[#7a8190] italic pl-4 py-2">
                ... analyzing sentiment and preparing rebuttal ...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Encounter Evaluation Report */}
      {showScore && score !== null && (
        <div className="bg-[#111318] border border-[#c89d7c]/30 rounded-xl p-8 text-left space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#c89d7c] mb-1">
                SYNTHESIZED EVALUATION
              </div>
              <h2 className="font-serif text-3xl text-[#f2f0eb]">
                Compatibility Assessment
              </h2>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-[#7a8190]">INDEX SCORE</div>
              <div className="font-serif italic text-5xl text-[#c89d7c]">
                {score} <span className="font-mono text-sm not-italic text-[#7a8190]">/ 100</span>
              </div>
            </div>
          </div>

          {/* Thesis */}
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-[#a4aab7]">Synergy Synthesis</div>
            <p className="font-sans text-sm text-[#c8cbd5] leading-relaxed font-light">
              {matches?.matchReason || `${personA.name} and ${personB.name} exhibit high complementarity in their creative stamina and mutual appetite for independent growth.`}
            </p>
          </div>

          {/* Sparks and Tensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.06]">
            <div className="bg-[#14171f] p-5 rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#c89d7c] mb-3">
                <Sparkles size={14} />
                <span>Catalytic Sparks</span>
              </div>
              <ul className="space-y-2 text-xs text-[#c5c9d4] font-light">
                {(matches?.sparks || [
                  'Shared devotion to self-directed high agency',
                  'Mutual appreciation for intellectual depth over superficiality',
                ]).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#c89d7c] font-mono">0{idx + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#14171f] p-5 rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#d46853] mb-3">
                <AlertTriangle size={14} />
                <span>Frictional Vulnerabilities</span>
              </div>
              <ul className="space-y-2 text-xs text-[#c5c9d4] font-light">
                {(matches?.tensions || [
                  'High work travel cadence may constrain spontaneous quality time',
                  'Differing sleep and recovery schedules requiring proactive alignment',
                ]).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#d46853] font-mono">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Replay or Explore Leaderboards */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
            <button
              onClick={() => {
                setDisplayedMsgs([])
                setShowScore(false)
                setTimeout(playConversation, 300)
              }}
              className="font-mono text-xs uppercase tracking-wider text-[#8b919e] hover:text-[#f2f0eb] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Replay Encounter</span>
            </button>

            <div className="flex items-center gap-4">
              <Link
                to={`/rankings/${personA.id}`}
                className="font-mono text-xs text-[#c89d7c] hover:underline flex items-center gap-1"
              >
                <span>{personA.name}'s Ranked Fits</span>
                <ArrowUpRight size={12} />
              </Link>
              <span className="text-white/[0.1]">•</span>
              <Link
                to={`/rankings/${personB.id}`}
                className="font-mono text-xs text-[#c89d7c] hover:underline flex items-center gap-1"
              >
                <span>{personB.name}'s Ranked Fits</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
