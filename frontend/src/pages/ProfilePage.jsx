import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Play, Heart, ShieldAlert, Sparkles, MapPin, Users, Briefcase, Award } from 'lucide-react'
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
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">Retrieving Dossier...</div>
    </div>
  )

  const candidateMatches = allPeople.filter(p => String(p.id) !== String(id))
  const samplePartner = candidateMatches.length > 0 ? candidateMatches[0] : null
  const scoreKeys = person.lifestyleScore ? Object.keys(person.lifestyleScore) : []

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Return link */}
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={14} />
        <span>Return to All Subjects</span>
      </Link>

      {/* Hero Dossier Card */}
      <div className="aura-card p-8 mb-8 border border-white/[0.1] bg-[#101726]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={person.photo}
                alt={person.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-rose-500/40 shadow-xl"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl items-center justify-center font-bold text-3xl text-rose-400 bg-slate-800 border-2 border-rose-500/40"
                style={{ display: person.photo ? 'none' : 'flex' }}
              >
                {person.name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest">
                  SUBJECT #{String(person.id).padStart(3, '0')}
                </span>
                {person.isVerified && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Verified Public Profiles
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                {person.name}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl leading-snug">
                {person.headline || 'Independent Operator'}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
                {person.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-rose-400" />
                    <span>{person.location}</span>
                  </span>
                )}
                {person.followers > 0 && (
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-sky-400" />
                    <span>{(person.followers).toLocaleString()} IG Followers</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Official Verification Links */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0 font-mono text-xs">
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-[#0077b5]/20 text-slate-200 hover:text-white border border-white/[0.08] hover:border-[#0077b5]/50 transition-all"
            >
              <LinkedinIcon size={14} className="text-[#0077b5]" />
              <span>LinkedIn Profile</span>
              <ArrowUpRight size={13} className="opacity-60" />
            </a>

            <a
              href={person.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-200 hover:text-white border border-white/[0.08] hover:border-rose-500/50 transition-all"
            >
              <InstagramIcon size={14} className="text-rose-400" />
              <span>Instagram Profile</span>
              <ArrowUpRight size={13} className="opacity-60" />
            </a>
          </div>
        </div>

        {/* Agent Voice Persona Box */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-rose-950/30 to-slate-900 border border-rose-500/20 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-1">
              Autonomous Agent Voice & Dating Thesis
            </div>
            <blockquote className="text-sm md:text-base text-slate-100 italic leading-relaxed">
              "{person.agentVoice || `I represent ${person.name} in dating simulations. I look for someone who can match their unrelenting ambition without losing warmth.`}"
            </blockquote>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.06]">
          {samplePartner && (
            <Link
              to={`/date/${person.id}/${samplePartner.id}`}
              className="font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2 transition-all shadow-md shadow-rose-500/25"
            >
              <Play size={13} fill="currentColor" />
              <span>Launch Live Date Simulation</span>
            </Link>
          )}

          <Link
            to={`/rankings/${person.id}`}
            className="font-mono text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-white/[0.08] flex items-center gap-2 transition-all"
          >
            <span>View All Ranked Fits</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* Psychological Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Needs */}
        <div className="aura-card p-6 bg-[#101726]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 pb-3 border-b border-white/[0.06]">
            <Heart size={15} />
            <span>Relationship Imperatives (Needs)</span>
          </div>
          <ul className="space-y-2.5">
            {(person.needs || []).map((need, i) => (
              <li key={i} className="text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed">
                <span className="font-mono text-rose-400 font-bold">0{i + 1}.</span>
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dealbreakers */}
        <div className="aura-card p-6 bg-[#101726]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 pb-3 border-b border-white/[0.06]">
            <ShieldAlert size={15} />
            <span>Non-Negotiables (Dealbreakers)</span>
          </div>
          <ul className="space-y-2.5">
            {(person.dealbreakers || []).map((db, i) => (
              <li key={i} className="text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed">
                <span className="font-mono text-amber-400 font-bold">✕</span>
                <span>{db}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hobbies & Lifestyle */}
        <div className="aura-card p-6 bg-[#101726]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-sky-400 mb-4 pb-3 border-b border-white/[0.06]">
            <Award size={15} />
            <span>Lifestyle, Rituals & Hobbies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(person.hobbies || []).map((h, i) => (
              <span key={i} className="data-pill bg-slate-900 border-white/[0.08] text-slate-200">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Intellectual Pursuits */}
        <div className="aura-card p-6 bg-[#101726]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-3 border-b border-white/[0.06]">
            <Briefcase size={15} />
            <span>Intellectual Interests & Themes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(person.interests || []).map((interest, i) => (
              <span key={i} className="data-pill bg-slate-900 border-white/[0.08] text-slate-200">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Calibration Gauges */}
      {scoreKeys.length > 0 && (
        <div className="aura-card p-8 bg-[#101726]">
          <div className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold mb-6 pb-3 border-b border-white/[0.06]">
            Lifestyle Vector Calibration
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {scoreKeys.map(key => {
              const val = person.lifestyleScore[key]
              return (
                <div key={key}>
                  <div className="flex justify-between items-center font-mono text-xs mb-1.5">
                    <span className="uppercase text-slate-400 tracking-wider">{key} Quotient</span>
                    <span className="text-white font-bold">{val} / 10</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-700"
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
