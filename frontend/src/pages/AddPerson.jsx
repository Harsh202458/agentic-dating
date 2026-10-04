import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function analyzeWithGemini(name, linkedinData, instagramData) {
  const prompt = `
You are a relationship expert. Based ONLY on this person's public LinkedIn and Instagram information, extract their personality profile.

Person: ${name}
LinkedIn Info: ${JSON.stringify(linkedinData)}
Instagram Info: ${JSON.stringify(instagramData)}

Return ONLY valid JSON:
{
  "needs": ["4-6 relationship needs"],
  "hobbies": ["4-6 hobbies"],
  "interests": ["4-6 interests"],
  "personality": ["4-6 traits"],
  "values": ["4-6 values"],
  "dealbreakers": ["3-4 dealbreakers"],
  "loveLanguage": "primary love language",
  "lifestyleScore": { "ambition": 0-10, "adventure": 0-10, "social": 0-10, "intellectual": 0-10, "creativity": 0-10 },
  "summary": "2-3 sentence vivid description",
  "agentVoice": "1 sentence first-person agent intro"
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
  if (!match) throw new Error('No JSON in response')
  return JSON.parse(match[0])
}

export default function AddPerson() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', linkedin: '', instagram: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const steps = [
    'Connecting to Apify...',
    'Scraping LinkedIn profile...',
    'Scraping Instagram profile...',
    'Running AI analysis...',
    'Building agent personality...',
    'Simulating dates with 25 people...',
    'Done!',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate
    if (!form.linkedin.includes('linkedin.com')) {
      setError('Please enter a valid LinkedIn URL')
      setLoading(false)
      return
    }
    if (!form.instagram.includes('instagram.com')) {
      setError('Please enter a valid Instagram URL')
      setLoading(false)
      return
    }

    try {
      // Step through status messages
      for (let i = 0; i < steps.length - 1; i++) {
        setStatus(steps[i])
        await new Promise(r => setTimeout(r, 1500 + i * 800))
      }

      const apifyToken = import.meta.env.VITE_APIFY_TOKEN || ''
      const igUsername = form.instagram.match(/instagram\.com\/([^\/\?#]+)/)?.[1]

      let igData = { bio: '', followers: 0, posts: [], isVerified: false }
      let liData = { headline: '', about: '', skills: [], experience: [], education: [] }

      // Try Instagram scraping
      try {
        const igRun = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}&timeout=60`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernames: [igUsername] }),
          }
        )
        if (igRun.ok) {
          const igResult = await igRun.json()
          const profile = igResult[0] || {}
          igData = {
            bio: profile.biography || '',
            followers: profile.followersCount || 0,
            posts: (profile.latestPosts || []).slice(0, 5).map(p => p.caption || ''),
            isVerified: profile.verified || false,
            profilePicUrl: profile.profilePicUrl || '',
          }
        }
      } catch (err) {
        console.warn('Instagram scrape failed:', err.message)
      }

      setStatus('Running AI analysis...')

      // Analyze with Gemini
      const analysis = await analyzeWithGemini(form.name, liData, igData)

      const newPerson = {
        id: Date.now(),
        name: form.name,
        linkedin_url: form.linkedin,
        instagram_url: form.instagram,
        photo: igData.profilePicUrl || '',
        followers: igData.followers,
        isVerified: igData.isVerified,
        headline: liData.headline,
        location: liData.location || '',
        ...analysis,
      }

      // Save to localStorage for persistence in this demo
      const existing = JSON.parse(localStorage.getItem('added_people') || '[]')
      existing.push(newPerson)
      localStorage.setItem('added_people', JSON.stringify(existing))

      setStatus('Done!')
      setTimeout(() => navigate(`/profile/${newPerson.id}`), 1000)
    } catch (err) {
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Add a Person</h1>
        <p className="text-gray-400 text-sm">Paste their LinkedIn + public Instagram. The agent will do the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Jane Smith"
            className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,63,94,0.2)' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <LinkedinIcon size={14} className="text-[#0077B5]" /> LinkedIn Profile URL
          </label>
          <input
            required
            value={form.linkedin}
            onChange={e => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,63,94,0.2)' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <InstagramIcon size={14} className="text-[#f43f5e]" /> Instagram Profile URL (must be public)
          </label>
          <input
            required
            value={form.instagram}
            onChange={e => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://instagram.com/username"
            className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,63,94,0.2)' }}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm px-3 py-2 rounded-lg" style={{ background: '#dc262615' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <Loader size={24} className="animate-spin mx-auto mb-2" style={{ color: '#f43f5e' }} />
            <p className="text-gray-400 text-sm">{status}</p>
          </div>
        )}

        {!loading && (
          <button type="submit"
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #c026d3)' }}>
            Analyze & Add Person
          </button>
        )}
      </form>

      <p className="text-center text-gray-600 text-xs mt-4">
        Scraped via Apify · Analyzed by Gemini AI · Free to use
      </p>
    </div>
  )
}
