import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Compass, ShieldAlert, HeartHandshake, Eye, Sparkles } from 'lucide-react'
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
      <div className="font-mono text-xs uppercase tracking-widest text-[#7a8190] mb-2">Retrieving Record</div>
      <div className="font-serif italic text-2xl text-[#f2f0eb]">Loading subject dossier...</div>
    </div>
  )

  const candidateMatches = allPeople.filter(p => String(p.id) !== String(id))
  const samplePartner = candidateMatches.length > 0 ? candidateMatches[0] : null
  const scoreKeys = person.lifestyleScore ? Object.keys(person.lifestyleScore) : []

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-[#7a8190] hover:text-[#c89d7c] transition-colors mb-8">
        <ArrowLeft size={14} />
        <span>Return to Subject Index</span>
      </Link>

      {/* Dossier Header */}
      <header className="border-b border-white/[0.08] pb-10 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#c89d7c] mb-2 flex items-center gap-2">
              <span>DOSSIER // SUBJECT ID #{String(person.id).padStart(3, '0')}</span>
              <span className="text-white/[0.15]">|</span>
              <span className="text-[#8e95a5]">APIFY INGESTED</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#f2f0eb] tracking-tight">
              {person.name}
            </h1>
            <p className="font-sans text-sm md:text-base text-[#9ea3ae] max-w-2xl mt-2 font-light leading-relaxed">
              {person.headline || 'Independent Operator'}
            </p>
          </div>

          {/* Social Proof & External Links */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-mono text-xs px-3.5 py-2 rounded bg-[#13151b] border border-white/[0.08] text-[#a4aab7] hover:text-[#f2f0eb] hover:border-[#0077b5]/50 transition-all"
            >
              <LinkedinIcon size={14} className="text-[#0077b5]" />
              <span>LinkedIn</span>
              <ArrowUpRight size={12} className="opacity-60" />
            </a>
            <a
              href={person.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-mono text-xs px-3.5 py-2 rounded bg-[#13151b] border border-white/[0.08] text-[#a4aab7] hover:text-[#f2f0eb] hover:border-[#d46853]/50 transition-all"
            >
              <InstagramIcon size={14} className="text-[#d46853]" />
              <span>Instagram</span>
              <ArrowUpRight size={12} className="opacity-60" />
            </a>
          </div>
        </div>

        {/* Hero Subject Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-white/[0.05]">
          <div className="md:col-span-4">
            <div className="relative rounded-lg overflow-hidden border border-white/[0.1] bg-[#12141a]">
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full aspect-[4/5] object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
              ) : null}
              <div
                className="w-full aspect-[4/5] items-center justify-center font-serif italic text-6xl text-[#c89d7c]"
                style={{ display: person.photo ? 'none' : 'flex' }}
              >
                {person.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#090a0d] to-transparent">
                <div className="font-mono text-[10px] uppercase text-[#c89d7c]">Primary Love Language</div>
                <div className="font-serif italic text-lg text-[#f2f0eb]">{person.loveLanguage || 'Intentional Presence'}</div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
              <div className="bg-[#12141a] p-3 rounded border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280]">FOLLOWERS</div>
                <div className="text-[#f2f0eb] mt-0.5">{person.followers ? (person.followers).toLocaleString() : 'Public'}</div>
              </div>
              <div className="bg-[#12141a] p-3 rounded border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280]">LOCATION</div>
                <div className="text-[#f2f0eb] mt-0.5 truncate">{person.location || 'Global'}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between h-full space-y-6">
            {/* Agent Voice Persona Statement */}
            <div className="bg-[#12141a] border border-white/[0.08] p-6 rounded-lg">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#c89d7c] mb-2">
                <Sparkles size={13} />
                <span>Autonomous Agent Voice · Dating Mandate</span>
              </div>
              <blockquote className="font-serif italic text-xl md:text-2xl text-[#f2f0eb] leading-snug">
                "{person.agentVoice || `I represent ${person.name} in dating simulations. I look for someone who can match their unrelenting ambition without losing warmth.`}"
              </blockquote>
            </div>

            {/* Personality Summary */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#8b919e]">Executive Psychological Profile</h3>
              <p className="font-sans text-sm text-[#c5c9d3] leading-relaxed font-light">
                {person.summary}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.06]">
              {samplePartner && (
                <Link
                  to={`/date/${person.id}/${samplePartner.id}`}
                  className="font-mono text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded bg-[#c89d7c] hover:bg-[#d6ad8e] text-[#090a0d] transition-all flex items-center gap-2"
                >
                  <span>Launch Simulated Date</span>
                  <ArrowUpRight size={14} />
                </Link>
              )}
              <Link
                to={`/rankings/${person.id}`}
                className="font-mono text-xs uppercase tracking-wider px-5 py-3 rounded bg-[#161821] hover:bg-[#1e222c] border border-white/[0.1] text-[#f2f0eb] transition-all flex items-center gap-2"
              >
                <span>View Full Compatibility Roster</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Structural Data Breakdown (Editorial Dossier Sections) */}
      <section className="space-y-12">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#c89d7c] mb-6 flex items-center gap-2">
            <span>Section 01 // Psychological Architecture</span>
            <span className="flex-1 h-px bg-white/[0.06]" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Needs */}
            <div className="bg-[#111318] p-6 rounded-lg border border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a4aab7] mb-4">
                <HeartHandshake size={14} className="text-[#c89d7c]" />
                <span>Relationship Imperatives (Needs)</span>
              </div>
              <ul className="space-y-2.5">
                {(person.needs || []).map((need, i) => (
                  <li key={i} className="text-xs text-[#d2d5de] font-light flex items-start gap-2.5">
                    <span className="font-mono text-[10px] text-[#c89d7c] mt-0.5">0{i + 1}.</span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dealbreakers */}
            <div className="bg-[#111318] p-6 rounded-lg border border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a4aab7] mb-4">
                <ShieldAlert size={14} className="text-[#d46853]" />
                <span>Non-Negotiables (Dealbreakers)</span>
              </div>
              <ul className="space-y-2.5">
                {(person.dealbreakers || []).map((db, i) => (
                  <li key={i} className="text-xs text-[#d2d5de] font-light flex items-start gap-2.5">
                    <span className="font-mono text-[10px] text-[#d46853] mt-0.5">✕</span>
                    <span>{db}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hobbies & Sensory Graph */}
            <div className="bg-[#111318] p-6 rounded-lg border border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a4aab7] mb-4">
                <Compass size={14} className="text-[#c89d7c]" />
                <span>Lifestyle, Rituals & Hobbies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(person.hobbies || []).map((h, i) => (
                  <span key={i} className="badge-tag">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Intellectual Interests */}
            <div className="bg-[#111318] p-6 rounded-lg border border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a4aab7] mb-4">
                <Eye size={14} className="text-[#c89d7c]" />
                <span>Intellectual Curiosity & Research</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(person.interests || []).map((interest, i) => (
                  <span key={i} className="badge-tag border-white/[0.05] text-[#b4b9c5]">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 02: Lifestyle Calibration Matrix */}
        {scoreKeys.length > 0 && (
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#c89d7c] mb-6 flex items-center gap-2">
              <span>Section 02 // Lifestyle Calibration Matrix</span>
              <span className="flex-1 h-px bg-white/[0.06]" />
            </h2>

            <div className="bg-[#111318] p-8 rounded-lg border border-white/[0.06] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {scoreKeys.map(key => {
                  const val = person.lifestyleScore[key]
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center font-mono text-xs mb-2">
                        <span className="uppercase text-[#8a91a0] tracking-wider">{key} Quotient</span>
                        <span className="text-[#f2f0eb] font-semibold">{val} / 10</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#c89d7c] to-[#d46853] transition-all duration-700"
                          style={{ width: `${val * 10}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
