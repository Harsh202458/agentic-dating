import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Zap, Star } from 'lucide-react'

export default function Home() {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        setPeople([...added, ...data])
        setLoading(false)
      })
      .catch(() => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        setPeople(added)
        setLoading(false)
      })
  }, [])

  const filtered = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Heart className="heartbeat mx-auto mb-4" style={{ color: '#f43f5e' }} size={48} fill="#f43f5e" />
        <p className="text-gray-400 text-lg">Loading agents...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4">
          <span className="gradient-text">AI Agents. Real People.</span>
          <br />
          <span className="text-white">Dating on Their Behalf.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Each person is represented by an AI agent. The agents read their LinkedIn and Instagram, build a personality profile, and date on their behalf.
        </p>
        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {[
            { icon: <Users size={18} />, label: `${people.length} People` },
            { icon: <Heart size={18} />, label: `${people.length * (people.length - 1) / 2} Matches Run` },
            { icon: <Zap size={18} />, label: 'Gemini Powered' },
            { icon: <Star size={18} />, label: 'Apify Scraped' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search people..."
            className="w-full px-5 py-3 rounded-full text-white outline-none text-sm"
            style={{
              background: 'rgba(26,16,37,0.9)',
              border: '1px solid rgba(244,63,94,0.3)',
            }}
          />
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No people found. <Link to="/add" className="text-rose-400 underline">Add someone?</Link>
        </div>
      )}
    </div>
  )
}

function PersonCard({ person }) {
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const colors = ['#f43f5e', '#c026d3', '#7c3aed', '#2563eb', '#059669']
  const color = colors[person.id % colors.length]

  return (
    <Link to={`/profile/${person.id}`} className="glass-card glow-hover p-4 block transition-all duration-300 hover:scale-105">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-3">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            className="w-16 h-16 rounded-full object-cover border-2"
            style={{ borderColor: color }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `2px solid ${color}`, display: person.photo ? 'none' : 'flex' }}
        >
          {initials}
        </div>
        {person.isVerified && (
          <span className="text-xs mt-1" style={{ color }}>✓ Verified</span>
        )}
      </div>

      <h3 className="font-bold text-center text-sm text-white mb-1">{person.name}</h3>
      {person.headline && (
        <p className="text-xs text-gray-500 text-center mb-2 line-clamp-2">{person.headline}</p>
      )}
      {person.followers > 0 && (
        <p className="text-xs text-center text-gray-600 mb-2">{(person.followers / 1000).toFixed(0)}K followers</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 justify-center">
        {(person.hobbies || []).slice(0, 2).map(h => (
          <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
            {h}
          </span>
        ))}
      </div>

      <div className="mt-3 text-center">
        <span className="text-xs font-semibold text-rose-400">View Profile →</span>
      </div>
    </Link>
  )
}
