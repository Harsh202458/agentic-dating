import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, ArrowRight, Sparkles, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function ProfilePage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [allPeople, setAllPeople] = useState([])
  const [activeTab, setActiveTab] = useState('SIGNALS') // 'SIGNALS' | 'EVIDENCE'

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
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center font-mono text-xs text-slate-500">
      Reconstructing Neural Profile...
    </div>
  )

  const candidateMatches = allPeople.filter(p => String(p.id) !== String(id))
  const samplePartner = candidateMatches.length > 0 ? candidateMatches[0] : null

  return (
    <div className="min-h-screen bg-[#05050a] text-white pt-24 pb-20 px-6 selection:bg-rose-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Return */}
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors mb-10">
          <ArrowLeft size={14} />
          <span>RETURN TO MATCHMAKING UNIVERSE</span>
        </Link>

        {/* Cinematic Header: Person -> AI Agent */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/[0.1] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            {/* Person & Agent Visual Orb */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-pulse-slow">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                AI AGENT PRIME
              </span>
            </div>

            {/* Identity Info */}
            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {person.name}
                </h1>
              </div>
              <p className="text-sm text-slate-300 font-light max-w-lg mt-1">
                {person.headline}
              </p>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {person.location} · {(person.followers || 0).toLocaleString()} Instagram Followers
              </div>

              {/* Verified Sources */}
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                <a
                  href={person.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-white/[0.08]"
                >
                  <LinkedinIcon size={13} className="text-[#0077b5]" />
                  <span>LinkedIn</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
                <a
                  href={person.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-white/[0.08]"
                >
                  <InstagramIcon size={13} className="text-rose-400" />
                  <span>Instagram</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex flex-col gap-2.5 w-full md:w-auto">
              {samplePartner && (
                <Link
                  to={`/date/${person.id}/${samplePartner.id}`}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform hover:scale-105"
                >
                  <Play size={12} fill="currentColor" />
                  <span>LAUNCH DATE</span>
                </Link>
              )}
              <Link
                to={`/rankings/${person.id}`}
                className="px-6 py-3 rounded-full glass-panel hover:bg-white/[0.1] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/[0.1]"
              >
                <span>ALL RANKED FITS →</span>
              </Link>
            </div>
          </div>

          {/* Agent Voice Quote */}
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <div className="font-mono text-[10px] uppercase text-rose-400 font-bold mb-1">
              AUTONOMOUS DATING MANDATE:
            </div>
            <p className="text-base text-slate-200 italic font-light leading-relaxed">
              "{person.agentVoice}"
            </p>
          </div>
        </div>

        {/* Tab Switcher: Intelligence Signals vs Source Evidence */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/[0.08] pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('SIGNALS')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'SIGNALS' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            INTELLIGENCE SIGNALS
          </button>
          <button
            onClick={() => setActiveTab('EVIDENCE')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'EVIDENCE' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>SOURCE EVIDENCE</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">OBSERVED / INFERRED</span>
          </button>
        </div>

        {/* TAB 1: FLOATING INTELLIGENCE SIGNALS */}
        {activeTab === 'SIGNALS' && (
          <div className="space-y-6">
            {/* Interests & Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
                <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-bold mb-3 pb-2 border-b border-white/[0.06]">
                  INTERESTS & TOPICS
                </div>
                <div className="space-y-2">
                  {(person.interests || []).map((int, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-center gap-2 font-mono">
                      <span className="text-rose-400">✦</span>
                      <span>{int}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
                <div className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold mb-3 pb-2 border-b border-white/[0.06]">
                  CORE VALUES & AXIOMS
                </div>
                <div className="space-y-2">
                  {(person.values || []).map((val, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-center gap-2 font-mono">
                      <span className="text-sky-400">✦</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Needs & Dealbreakers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
                <div className="font-mono text-xs text-pink-400 uppercase tracking-widest font-bold mb-3 pb-2 border-b border-white/[0.06]">
                  RELATIONSHIP NEEDS
                </div>
                <div className="space-y-2">
                  {(person.needs || []).map((need, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-center gap-2 font-mono">
                      <span className="text-pink-400">0{i + 1}.</span>
                      <span>{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
                <div className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold mb-3 pb-2 border-b border-white/[0.06]">
                  NON-NEGOTIABLES & DEALBREAKERS
                </div>
                <div className="space-y-2">
                  {(person.dealbreakers || []).map((db, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-center gap-2 font-mono">
                      <span className="text-amber-400">✕</span>
                      <span>{db}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hobbies & Lifestyle */}
            <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold mb-3 pb-2 border-b border-white/[0.06]">
                LIFESTYLE, RITUALS & HOBBIES (INSTAGRAM EXTRACTED)
              </div>
              <div className="flex flex-wrap gap-2">
                {(person.hobbies || []).map((h, i) => (
                  <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-200 border border-white/[0.08]">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOURCE EVIDENCE (OBSERVED / INFERRED / UNKNOWN) */}
        {activeTab === 'EVIDENCE' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>DIRECTLY OBSERVED EVIDENCE (GROUND TRUTH)</span>
              </div>
              <ul className="space-y-2 font-mono text-xs text-slate-300">
                {(person.observed_facts || []).map((fact, idx) => (
                  <li key={idx} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">OBSERVED</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
              <div className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <Sparkles size={14} />
                <span>REASONABLE INFERENCES (DERIVED BY AGENT)</span>
              </div>
              <div className="space-y-2">
                {(person.inferred_traits || []).map((inf, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs">
                    <div>
                      <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold mr-2">INFERRED</span>
                      <strong className="text-white">{inf.trait}</strong>
                      <span className="text-slate-400 ml-2">— {inf.rationale}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] shrink-0 font-bold">Conf: {inf.confidence}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
              <div className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <HelpCircle size={14} />
                <span>UNKNOWN INFORMATION (HONESTY PROTOCOL — PREVENTS HALLUCINATION)</span>
              </div>
              <ul className="space-y-2 font-mono text-xs text-slate-400">
                {(person.unknown_factors || []).map((unk, idx) => (
                  <li key={idx} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">UNKNOWN</span>
                    <span>{unk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
