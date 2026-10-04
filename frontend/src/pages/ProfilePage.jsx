import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Heart, Star, Zap, Users } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function ProfilePage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [allPeople, setAllPeople] = useState([])

  useEffect(() => {
    fetch('/data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        const all = [...added, ...data]
        setAllPeople(all)
        setPerson(all.find(p => String(p.id) === String(id)))
      })
      .catch(console.error)
  }, [id])

  if (!person) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Heart className="heartbeat" style={{ color: '#f43f5e' }} size={48} fill="#f43f5e" />
    </div>
  )

  const colors = ['#f43f5e', '#c026d3', '#7c3aed', '#2563eb', '#059669']
  const color = colors[person.id % colors.length]
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const scoreKeys = person.lifestyleScore ? Object.keys(person.lifestyleScore) : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <Link to="/" className="text-sm text-gray-500 hover:text-rose-400 mb-6 inline-block">← Back to all people</Link>

      {/* Header Card */}
      <div className="glass-card p-8 mb-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0 text-center">
          {person.photo ? (
            <img src={person.photo} alt={person.name}
              className="w-28 h-28 rounded-full object-cover border-4 mx-auto"
              style={{ borderColor: color }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
          ) : null}
          <div
            className="w-28 h-28 rounded-full items-center justify-center text-4xl font-bold text-white mx-auto"
            style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `4px solid ${color}`, display: person.photo ? 'none' : 'flex' }}
          >{initials}</div>
          <div className="flex gap-2 justify-center mt-3">
            <a href={person.linkedin_url} target="_blank" rel="noreferrer"
              className="p-2 rounded-full transition-colors hover:opacity-80"
              style={{ background: '#0077B520', color: '#0077B5' }}>
              <LinkedinIcon size={16} />
            </a>
            <a href={person.instagram_url} target="_blank" rel="noreferrer"
              className="p-2 rounded-full transition-colors hover:opacity-80"
              style={{ background: '#f43f5e20', color: '#f43f5e' }}>
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-3xl font-extrabold text-white">{person.name}</h1>
            {person.isVerified && <span className="text-xs px-2 py-0.5 rounded-full text-blue-400 border border-blue-400/30 bg-blue-400/10">✓ Verified</span>}
          </div>
          {person.headline && <p className="text-gray-400 text-sm mb-2">{person.headline}</p>}
          {person.location && (
            <p className="text-gray-600 text-xs flex items-center gap-1 mb-3"><MapPin size={12} />{person.location}</p>
          )}
          {person.followers > 0 && (
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <Users size={12} /> {person.followers.toLocaleString()} Instagram followers
            </p>
          )}
          <div className="glass-card p-4 border-l-2 mb-4" style={{ borderColor: color }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Zap size={12} />Agent Voice</p>
            <p className="text-white italic text-sm">"{person.agentVoice || `I'm ${person.name}'s agent — ready to find their perfect match.`}"</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{person.summary}</p>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AnalysisCard title="💖 Needs" items={person.needs} color="#f43f5e" />
        <AnalysisCard title="🎯 Hobbies" items={person.hobbies} color="#c026d3" />
        <AnalysisCard title="🧠 Interests" items={person.interests} color="#7c3aed" />
        <AnalysisCard title="✨ Personality" items={person.personality} color="#2563eb" />
        <AnalysisCard title="🌟 Values" items={person.values} color="#059669" />
        <AnalysisCard title="🚫 Dealbreakers" items={person.dealbreakers} color="#dc2626" />
      </div>

      {/* Love Language + Lifestyle Scores */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">💝 Love Language & Lifestyle</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">Primary Love Language:</span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, #f43f5e, #c026d3)` }}>
            {person.loveLanguage || 'Words of Affirmation'}
          </span>
        </div>
        {scoreKeys.length > 0 && (
          <div className="space-y-3">
            {scoreKeys.map(key => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 capitalize">{key}</span>
                  <span className="text-white font-semibold">{person.lifestyleScore[key]}/10</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="score-bar" style={{ width: `${person.lifestyleScore[key] * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to={`/rankings/${person.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #c026d3)' }}>
          <Star size={16} /> View Rankings
        </Link>
        {allPeople.filter(p => p.id !== person.id).slice(0, 1).map(other => (
          <Link key={other.id} to={`/date/${person.id}/${other.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all hover:scale-105 glass-card glow-hover"
            style={{ color: '#f43f5e' }}>
            <Heart size={16} /> Watch Agent Date
          </Link>
        ))}
      </div>
    </div>
  )
}

function AnalysisCard({ title, items = [], color }) {
  return (
    <div className="glass-card p-5">
      <h3 className="font-bold text-sm text-white mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="text-xs px-3 py-1 rounded-full"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            {item}
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-gray-600">Analyzing...</span>}
      </div>
    </div>
  )
}
