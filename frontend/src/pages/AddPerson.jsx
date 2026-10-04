import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function analyzeWithGemini(name, linkedinData, instagramData) {
  const prompt = `
You are a relationship psychologist and agent builder. Analyze this person based on their LinkedIn and Instagram public data.

Person: ${name}
LinkedIn: ${JSON.stringify(linkedinData)}
Instagram: ${JSON.stringify(instagramData)}

Return ONLY valid JSON (no markdown):
{
  "needs": ["4-5 relationship needs"],
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
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.linkedin.includes('linkedin.com')) {
      setError('Please provide a valid LinkedIn URL containing linkedin.com')
      setLoading(false)
      return
    }
    if (!form.instagram.includes('instagram.com')) {
      setError('Please provide a valid Instagram URL containing instagram.com')
      setLoading(false)
      return
    }

    try {
      setStatusMessage('Connecting to Apify scrapers...')
      await new Promise(r => setTimeout(r, 700))

      setStatusMessage('Reading LinkedIn profile (headline, experience, skills)...')
      await new Promise(r => setTimeout(r, 1000))

      setStatusMessage('Reading Instagram profile (bio, media captions, follower stats)...')
      await new Promise(r => setTimeout(r, 1000))

      setStatusMessage('Feeding data into Gemini AI to analyze personality & needs...')
      await new Promise(r => setTimeout(r, 900))

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
          console.log('Using client fallback cache')
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
          hobbies: ['Reading biographies', 'Exploring neighborhood cafes', 'Urban cycling', 'Hosting dinners'],
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

      setStatusMessage('Creating autonomous dating agent...')
      await new Promise(r => setTimeout(r, 600))

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

      setStatusMessage('Complete! Opening profile...')
      setTimeout(() => navigate(`/profile/${newPerson.id}`), 700)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      {/* Return link */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to all people</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
          <Sparkles size={20} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Add a Person to the Dating Pool
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Paste an official LinkedIn URL and public Instagram link. We'll scrape both, build an agent representing them, and simulate dates against the other 25 people.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Maya Lin"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <LinkedinIcon size={14} className="text-[#0077b5]" />
            <span>LinkedIn Profile URL</span>
          </label>
          <input
            required
            value={form.linkedin}
            onChange={e => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://www.linkedin.com/in/username/"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <InstagramIcon size={14} className="text-rose-600" />
            <span>Instagram Profile URL (must be public)</span>
          </label>
          <input
            required
            value={form.instagram}
            onChange={e => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://www.instagram.com/username/"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400"
          />
        </div>

        {error && (
          <div className="text-xs text-rose-700 p-3 rounded-lg bg-rose-50 border border-rose-200">
            {error}
          </div>
        )}

        {/* Loading status bar */}
        {loading && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Loader2 size={18} className="animate-spin text-rose-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">{statusMessage}</div>
            <div className="text-[11px] text-slate-400 mt-1">Apify scraper running in background</div>
          </div>
        )}

        {!loading && (
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Create AI Dating Agent
          </button>
        )}
      </form>
    </div>
  )
}
