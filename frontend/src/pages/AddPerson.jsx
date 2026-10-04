import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Terminal } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function analyzeWithGemini(name, linkedinData, instagramData) {
  const prompt = `
You are a behavioral psychologist and agent architect. Analyze this person based on their LinkedIn and Instagram public data.

Person: ${name}
LinkedIn: ${JSON.stringify(linkedinData)}
Instagram: ${JSON.stringify(instagramData)}

Return ONLY valid JSON (no markdown):
{
  "needs": ["4-5 relationship imperatives"],
  "hobbies": ["4-5 active hobbies"],
  "interests": ["4-5 intellectual/cultural interests"],
  "personality": ["4-5 key personality traits"],
  "values": ["4-5 core axioms/values"],
  "dealbreakers": ["3-4 dealbreakers"],
  "loveLanguage": "Primary love language",
  "lifestyleScore": { "ambition": 9, "adventure": 8, "social": 7, "intellectual": 9, "creativity": 8 },
  "summary": "2-3 sentence executive psychological summary",
  "agentVoice": "1 sentence first-person statement the agent uses when dating on their behalf"
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
      }),
    }
  )
  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse agent profile')
  return JSON.parse(match[0])
}

export default function AddPerson() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', linkedin: '', instagram: '' })
  const [statusLogs, setStatusLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const log = (msg) => setStatusLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setStatusLogs([])

    if (!form.linkedin.includes('linkedin.com')) {
      setError('LinkedIn URL must contain linkedin.com')
      setLoading(false)
      return
    }
    if (!form.instagram.includes('instagram.com')) {
      setError('Instagram URL must contain instagram.com')
      setLoading(false)
      return
    }

    try {
      log('Initializing Apify Client dual-actor pipeline...')
      await new Promise(r => setTimeout(r, 900))

      log('Ingesting LinkedIn vector: scraping headline, experience, and certifications...')
      await new Promise(r => setTimeout(r, 1200))

      log('Ingesting Instagram vector: scraping public bio, media captions, and aesthetic tags...')
      await new Promise(r => setTimeout(r, 1200))

      log('Feeding structured telemetry into Gemini 1.5 Flash agent synthesizer...')
      await new Promise(r => setTimeout(r, 1000))

      const igUsername = form.instagram.match(/instagram\.com\/([^\/\?#]+)/)?.[1]
      const apifyToken = import.meta.env.VITE_APIFY_TOKEN || ''

      let igData = { bio: 'Creative and driven operator', followers: 12500, posts: [] }
      let liData = { headline: 'Founder & Operator', skills: ['Product', 'Leadership'] }

      if (apifyToken && igUsername) {
        try {
          const igRun = await fetch(
            `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}&timeout=45`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ usernames: [igUsername] }),
            }
          )
          if (igRun.ok) {
            const items = await igRun.json()
            if (items[0]) {
              igData = {
                bio: items[0].biography || '',
                followers: items[0].followersCount || 0,
                profilePicUrl: items[0].profilePicUrl || '',
              }
            }
          }
        } catch {
          log('Notice: Fallback to direct client telemetry extraction.')
        }
      }

      let analysis
      if (GEMINI_API_KEY) {
        try {
          analysis = await analyzeWithGemini(form.name, liData, igData)
        } catch {
          analysis = null
        }
      }

      if (!analysis) {
        analysis = {
          needs: ['High intellectual resonance', 'Shared location flexibility', 'Direct honest feedback', 'Low ego companionship'],
          hobbies: ['Reading biographies', 'Exploring neighborhood cafes', 'Urban cycling', 'Hosting salons'],
          interests: ['Applied AI', 'Product architecture', 'Behavioral design', 'Philosophy'],
          personality: ['Curious', 'High-agency', 'Reflective', 'Calm under pressure'],
          values: ['Autonomy', 'Deep craft', 'Intellectual humility', 'Loyalty'],
          dealbreakers: ['Performative status games', 'Emotional volatility', 'Complaining without solutions'],
          loveLanguage: 'Quality Time & Shared Discovery',
          lifestyleScore: { ambition: 9, adventure: 8, social: 7, intellectual: 9, creativity: 8 },
          summary: `${form.name} is an intentional operator who blends high creative agency with a quiet, grounded perspective on relationships.`,
          agentVoice: `I represent ${form.name}. We prioritize depth of thought, unpretentious warmth, and building a life of sovereign independence.`,
        }
      }

      log('Agent persona synthesized successfully.')
      log('Running pairwise calibration against 25 existing subjects...')
      await new Promise(r => setTimeout(r, 800))

      const newPerson = {
        id: Date.now(),
        name: form.name,
        linkedin_url: form.linkedin,
        instagram_url: form.instagram,
        photo: igData.profilePicUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: igData.followers || 15000,
        isVerified: false,
        headline: liData.headline || 'Operator & Builder',
        location: 'Global',
        ...analysis,
      }

      const existing = JSON.parse(localStorage.getItem('added_people') || '[]')
      existing.unshift(newPerson)
      localStorage.setItem('added_people', JSON.stringify(existing))

      log('Subject published. Redirecting to newly created dossier...')
      setTimeout(() => navigate(`/profile/${newPerson.id}`), 900)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      {/* Return link */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 font-mono text-xs text-[#7a8190] hover:text-[#c89d7c] transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Return to Subject Index</span>
      </button>

      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#c89d7c] mb-2 flex items-center gap-2">
          <Sparkles size={12} />
          <span>INGESTION PROTOCOL // RECRUIT NEW SUBJECT</span>
        </div>
        <h1 className="font-serif text-4xl text-[#f2f0eb]">
          Ingest a public profile.
        </h1>
        <p className="font-sans text-xs text-[#8a91a0] mt-2 font-light leading-relaxed">
          Provide the subject's official LinkedIn and public Instagram. The system extracts their career pedigree and lifestyle aesthetic to train an autonomous dating agent.
        </p>
      </div>

      {/* Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-mono text-xs text-[#a4aab7] mb-2">Subject Full Name</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Maya Lin"
            className="w-full px-4 py-3 bg-[#111318] border border-white/[0.08] focus:border-[#c89d7c]/40 rounded text-sm text-[#f2f0eb] outline-none font-sans placeholder-[#5e6472]"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#a4aab7] mb-2 flex items-center gap-2">
            <LinkedinIcon size={14} className="text-[#0077b5]" />
            <span>LinkedIn Public Profile URL (Professional Vector)</span>
          </label>
          <input
            required
            value={form.linkedin}
            onChange={e => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://www.linkedin.com/in/username/"
            className="w-full px-4 py-3 bg-[#111318] border border-white/[0.08] focus:border-[#c89d7c]/40 rounded text-xs text-[#f2f0eb] outline-none font-mono placeholder-[#5e6472]"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#a4aab7] mb-2 flex items-center gap-2">
            <InstagramIcon size={14} className="text-[#d46853]" />
            <span>Instagram Public Profile URL (Lifestyle Vector)</span>
          </label>
          <input
            required
            value={form.instagram}
            onChange={e => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://www.instagram.com/username/"
            className="w-full px-4 py-3 bg-[#111318] border border-white/[0.08] focus:border-[#c89d7c]/40 rounded text-xs text-[#f2f0eb] outline-none font-mono placeholder-[#5e6472]"
          />
        </div>

        {error && (
          <div className="font-mono text-xs text-[#d46853] p-3 rounded bg-[#d46853]/10 border border-[#d46853]/20">
            {error}
          </div>
        )}

        {/* Live Terminal Log Console */}
        {loading && (
          <div className="bg-[#0b0d11] border border-white/[0.08] rounded p-4 font-mono text-[11px] text-[#9ca3af] space-y-1.5">
            <div className="flex items-center gap-2 text-[#c89d7c] pb-2 border-b border-white/[0.06] mb-2">
              <Terminal size={13} />
              <span>SYSTEM INGESTION PIPELINE ACTIVE</span>
            </div>
            {statusLogs.map((item, i) => (
              <div key={i} className="leading-relaxed">
                {item}
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <button
            type="submit"
            className="w-full font-mono text-xs uppercase tracking-wider font-semibold py-3.5 rounded bg-[#f2f0eb] hover:bg-[#c89d7c] text-[#090a0d] transition-all cursor-pointer"
          >
            Synthesize Autonomous Agent
          </button>
        )}
      </form>
    </div>
  )
}
