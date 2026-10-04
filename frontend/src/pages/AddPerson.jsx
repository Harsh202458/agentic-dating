import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'
import { calculateCompatibilityBreakdown, simulateAgenticDate } from '../utils/agentEngine'

const CREATION_STAGES = [
  { id: 'LINKS', label: 'LINKS VERIFIED' },
  { id: 'READ', label: 'EXTRACTING PUBLIC FOOTPRINT' },
  { id: 'UNDERSTAND', label: 'SYNTHESIZING PSYCHOLOGY' },
  { id: 'PERSONALITY', label: 'TRAINING AGENT MANDATE' },
  { id: 'AGENT', label: 'CALIBRATING PAIRWISE NETWORK' },
  { id: 'READY', label: 'AGENT INITIALIZED' }
]

export default function AddPerson() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', linkedin: '', instagram: '' })
  const [activeStage, setActiveStage] = useState(null)
  const [stageIdx, setStageIdx] = useState(0)
  const [extractedSignals, setExtractedSignals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateAgent = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setExtractedSignals([])

    if (!form.linkedin.includes('linkedin.com')) {
      setError('Please provide a valid official LinkedIn URL.')
      setLoading(false)
      return
    }
    if (!form.instagram.includes('instagram.com')) {
      setError('Please provide a valid public Instagram URL.')
      setLoading(false)
      return
    }

    try {
      // Stage 1: LINKS
      setActiveStage('LINKS')
      setStageIdx(0)
      await new Promise(r => setTimeout(r, 600))

      // Stage 2: READ
      setActiveStage('READ')
      setStageIdx(1)
      setExtractedSignals(prev => [...prev, '✓ LinkedIn Professional Pedigree Verified'])
      await new Promise(r => setTimeout(r, 800))
      setExtractedSignals(prev => [...prev, '✓ Instagram Visual & Activity Grid Verified'])
      await new Promise(r => setTimeout(r, 800))

      // Stage 3: UNDERSTAND
      setActiveStage('UNDERSTAND')
      setStageIdx(2)
      setExtractedSignals(prev => [...prev, '✦ Inferred Need: High Intellectual Autonomy'])
      await new Promise(r => setTimeout(r, 700))
      setExtractedSignals(prev => [...prev, '✦ Inferred Value: Radical Candor & Low Ego'])
      await new Promise(r => setTimeout(r, 700))

      // Stage 4: PERSONALITY
      setActiveStage('PERSONALITY')
      setStageIdx(3)
      setExtractedSignals(prev => [...prev, '✦ Mandate Formulated: Sovereign Dating Voice Primed'])
      await new Promise(r => setTimeout(r, 700))

      // Stage 5: AGENT & NETWORK CALIBRATION
      setActiveStage('AGENT')
      setStageIdx(4)
      setExtractedSignals(prev => [...prev, '✦ Simulating 25 Pairwise Encounters...'])

      const newId = Date.now()
      const newPerson = {
        id: newId,
        name: form.name,
        linkedin_url: form.linkedin,
        instagram_url: form.instagram,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: 14200,
        isVerified: true,
        headline: 'Creative Builder & Operator',
        location: 'Global',
        needs: ['High intellectual resonance', 'Shared location flexibility', 'Direct honest feedback', 'Low ego companionship'],
        hobbies: ['Reading biographies', 'Exploring neighborhood cafes', 'Urban cycling', 'Hosting dinners'],
        interests: ['Applied AI', 'Product architecture', 'Behavioral design', 'Philosophy'],
        personality: ['Curious', 'High-agency', 'Reflective', 'Calm under pressure'],
        values: ['Autonomy', 'Deep craft', 'Intellectual humility', 'Loyalty'],
        dealbreakers: ['Performative status games', 'Emotional volatility', 'Complaining without solutions'],
        loveLanguage: 'Quality Time & Shared Discovery',
        lifestyleScore: { ambition: 9, adventure: 8, social: 7, intellectual: 9, creativity: 8 },
        summary: `${form.name} is an intentional operator who blends high creative agency with a quiet, grounded perspective on relationships.`,
        agentVoice: `I represent ${form.name}. We prioritize depth of thought, unpretentious warmth, and building a life of sovereign independence.`,
        observed_facts: [
          `[LinkedIn] Official Profile verified: ${form.linkedin}`,
          `[Instagram] Public handle verified: ${form.instagram}`,
          `[Public Data] Career identity: Creative Builder & Operator`
        ],
        inferred_traits: [
          { trait: 'Self-Directed Autonomy', rationale: 'Inferred from independent career focus', confidence: '90%' },
          { trait: 'Values Authentic Craft', rationale: 'Inferred from public project cadence', confidence: '88%' }
        ],
        unknown_factors: [
          'Private Conflict Resolution Style: UNKNOWN (Not declared publicly)',
          'Domestic Routine & Chore Distribution: UNKNOWN (Private matter)',
          'Long-term Financial Sharing Terms: UNKNOWN (Excluded to avoid hallucination)'
        ],
        conversation_starters: [
          `"I was looking at your work—what currently demands most of your creative focus?"`,
          `"How do you prefer to recharge when you're off the clock?"`,
          `"What is one principle you never compromise on in a relationship?"`
        ]
      }

      // Pair against all 25 people
      const existingRosterRes = await fetch('./data/profiles_analyzed.json').then(r => r.json()).catch(() => [])
      const addedBefore = JSON.parse(localStorage.getItem('added_people') || '[]')
      const allCohort = [...addedBefore, ...existingRosterRes]

      const newRankings = []
      const existingMatchesStore = JSON.parse(localStorage.getItem('added_matches') || '{}')
      existingMatchesStore[newId] = {}

      allCohort.forEach(otherPerson => {
        const dateResult = simulateAgenticDate(newPerson, otherPerson)
        existingMatchesStore[newId][otherPerson.id] = dateResult
        newRankings.push({
          id: otherPerson.id,
          name: otherPerson.name,
          score: dateResult.breakdown.finalScore,
          reason: dateResult.matchReason,
          breakdown: dateResult.breakdown,
          sparks: dateResult.sparks,
          tensions: dateResult.tensions
        })
      })

      newRankings.sort((a, b) => b.score - a.score)

      addedBefore.unshift(newPerson)
      localStorage.setItem('added_people', JSON.stringify(addedBefore))
      localStorage.setItem('added_matches', JSON.stringify(existingMatchesStore))

      const addedRankingsStore = JSON.parse(localStorage.getItem('added_rankings') || '{}')
      addedRankingsStore[newId] = { id: newId, name: newPerson.name, ranked: newRankings }
      localStorage.setItem('added_rankings', JSON.stringify(addedRankingsStore))

      // Stage 6: READY
      setActiveStage('READY')
      setStageIdx(5)
      await new Promise(r => setTimeout(r, 900))

      navigate(`/profile/${newPerson.id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white pt-24 pb-20 px-6 flex flex-col justify-center selection:bg-rose-500/30">
      <div className="max-w-xl mx-auto w-full">
        {/* Return */}
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} />
          <span>RETURN TO UNIVERSE</span>
        </Link>

        {/* Chamber Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-400 font-bold mb-4">
            <Sparkles size={13} />
            <span>AGENT CREATION CHAMBER</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase glow-text-white mb-3">
            CREATE SOMEONE NEW.
          </h1>
          <p className="text-slate-400 text-sm font-light">
            Give the system two public profiles. An autonomous dating agent will be synthesized and released into the matchmaking network.
          </p>
        </div>

        {/* Form or Animated Process Chamber */}
        {!loading ? (
          <form onSubmit={handleCreateAgent} className="glass-panel p-8 rounded-3xl border border-white/[0.1] space-y-5">
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-300 mb-2">FULL NAME</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Maya Lin"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] focus:border-rose-500/60 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <LinkedinIcon size={14} className="text-[#0077b5]" />
                <span>OFFICIAL LINKEDIN URL</span>
              </label>
              <input
                required
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://www.linkedin.com/in/username/"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] focus:border-rose-500/60 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <InstagramIcon size={14} className="text-rose-400" />
                <span>PUBLIC INSTAGRAM URL</span>
              </label>
              <input
                required
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://www.instagram.com/username/"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] focus:border-rose-500/60 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
              />
            </div>

            {error && (
              <div className="font-mono text-xs text-rose-400 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:opacity-95 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-transform hover:scale-102 cursor-pointer mt-4"
            >
              <span>CREATE AGENT →</span>
            </button>
          </form>
        ) : (
          /* Animated Ingestion Chamber Sequence */
          <div className="glass-panel-glow p-8 rounded-3xl border border-rose-500/40 text-center space-y-6 animate-fade-in">
            {/* Pulsing Core */}
            <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 animate-pulse-slow">
              <div className="w-full h-full bg-[#05050a] rounded-full flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-rose-400" />
              </div>
            </div>

            {/* Stages Progress Track */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest">
                {CREATION_STAGES[stageIdx]?.label}
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${((stageIdx + 1) / CREATION_STAGES.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Live extracted stream of signals */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left font-mono text-xs space-y-2 min-h-[140px]">
              {extractedSignals.map((sig, idx) => (
                <div key={idx} className="text-slate-200 animate-fade-in flex items-center gap-2">
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
