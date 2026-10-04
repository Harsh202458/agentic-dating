import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, ArrowRight, Heart, ShieldAlert, Sparkles, MapPin, Users, Award, BookOpen, ExternalLink } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function ProfilePage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [allPeople, setAllPeople] = useState([])

  useEffect(() => {
    fetch('./data/profiles_analyzed.json')
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
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-3" />
      <div className="text-sm font-medium text-slate-500">Loading profile analysis...</div>
    </div>
  )

  const candidateMatches = allPeople.filter(p => String(p.id) !== String(id))
  const samplePartner = candidateMatches.length > 0 ? candidateMatches[0] : null
  const scoreKeys = person.lifestyleScore ? Object.keys(person.lifestyleScore) : []

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={14} />
        <span>Back to all people</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={person.photo}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-rose-200 shadow-sm"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div
              className="w-20 h-20 rounded-full items-center justify-center font-bold text-2xl text-rose-600 bg-rose-50 border-2 border-rose-200 shadow-sm"
              style={{ display: person.photo ? 'none' : 'flex' }}
            >
              {person.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {person.name}
                </h1>
                {person.isVerified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1 max-w-lg leading-snug">
                {person.headline || 'Independent Builder'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                {person.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{person.location}</span>
                  </span>
                )}
                {person.followers > 0 && (
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-slate-400" />
                    <span>{(person.followers).toLocaleString()} Instagram followers</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Social Proof Links */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
            >
              <LinkedinIcon size={14} className="text-[#0077b5]" />
              <span>LinkedIn</span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>
            <a
              href={person.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
            >
              <InstagramIcon size={14} className="text-rose-600" />
              <span>Instagram</span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* Agent Dating Persona Box */}
        <div className="mt-6 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1.5">
            <Sparkles size={13} className="text-rose-600" />
            <span>How This Person's Agent Introduces Itself on Dates</span>
          </div>
          <p className="text-sm text-slate-800 italic leading-relaxed">
            "{person.agentVoice || `I represent ${person.name}. I look for genuine depth and mutual ambition.`}"
          </p>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          {person.summary}
        </div>

        {/* Primary Actions */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {samplePartner && (
            <Link
              to={`/date/${person.id}/${samplePartner.id}`}
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Play size={13} fill="currentColor" />
              <span>Simulate a Date with Someone</span>
            </Link>
          )}

          <Link
            to={`/rankings/${person.id}`}
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>See {person.name}'s Match Rankings</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Analysis Sections: Needs, Dealbreakers, Hobbies, Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Needs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 pb-3 border-b border-slate-100 mb-4">
            <Heart size={15} className="text-rose-600" />
            <span>What They Look For in a Partner (Needs)</span>
          </div>
          <ul className="space-y-2.5">
            {(person.needs || []).map((need, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                <span className="font-bold text-rose-600">0{i + 1}.</span>
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dealbreakers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 pb-3 border-b border-slate-100 mb-4">
            <ShieldAlert size={15} className="text-amber-600" />
            <span>Non-Negotiables & Dealbreakers</span>
          </div>
          <ul className="space-y-2.5">
            {(person.dealbreakers || []).map((db, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                <span className="font-bold text-amber-600">✕</span>
                <span>{db}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hobbies from Instagram */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 mb-4">
            <Award size={15} className="text-slate-600" />
            <span>Hobbies & Daily Activities (from Instagram)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(person.hobbies || []).map((h, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Intellectual Pursuits from LinkedIn */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 mb-4">
            <BookOpen size={15} className="text-slate-600" />
            <span>Topics & Career Themes (from LinkedIn)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(person.interests || []).map((interest, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Metrics */}
      {scoreKeys.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 mb-6">
            Agent Personality & Lifestyle Calibration
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {scoreKeys.map(key => {
              const val = person.lifestyleScore[key]
              return (
                <div key={key}>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="capitalize text-slate-600">{key}</span>
                    <span className="text-slate-900">{val} / 10</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full"
                      style={{ width: `${val * 10}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
