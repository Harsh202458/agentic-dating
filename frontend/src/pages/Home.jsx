import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, Plus, ExternalLink, ShieldCheck, Heart } from 'lucide-react'
import UniverseCanvas from '../components/UniverseCanvas'
import { LinkedinIcon, InstagramIcon } from '../components/Icons'

export default function Home() {
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [p1, setP1] = useState('1')
  const [p2, setP2] = useState('3')

  useEffect(() => {
    fetch('./data/profiles_analyzed.json')
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]')
        const all = [...added, ...data]
        setPeople(all)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#05050a] text-white overflow-hidden selection:bg-rose-500/30">
      {/* ============================================================ */}
      {/* 1. HERO: IMMERSIVE MATCHMAKING UNIVERSE */}
      {/* ============================================================ */}
      <section className="relative h-screen w-full flex items-center justify-center">
        {/* Living interactive canvas behind everything */}
        <div className="absolute inset-0 z-0">
          <UniverseCanvas
            people={people}
            onSelectPerson={p => navigate(`/profile/${p.id}`)}
          />
        </div>

        {/* Ambient Dark Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/40 z-10" />

        {/* Hero Center Typography */}
        <div className="relative z-20 text-center max-w-4xl px-6 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-slate-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>AUTONOMOUS AGENTIC COURTSHIP PROTOCOL</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.88] text-white mb-6 select-none glow-text-white">
            LET<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-sky-400">
              THE AGENTS
            </span><br />
            DATE.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-lg">
            People choose their profiles. <br />
            <span className="text-white font-medium">Their agents choose their connections.</span>
          </p>

          {/* Action Buttons (pointer-events-auto so they can be clicked) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link
              to="/date/1/3"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:opacity-95 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-transform hover:scale-105 cursor-pointer"
            >
              <Play size={13} fill="currentColor" />
              <span>ENTER THE MATCHMAKING ROOM</span>
            </Link>

            <Link
              to="/add"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-panel hover:bg-white/[0.1] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/[0.15] transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>CREATE YOUR AGENT</span>
            </Link>
          </div>
        </div>

        {/* Bottom subtle prompt */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-60 text-[11px] font-mono tracking-widest uppercase">
          <span>Explore The System</span>
          <div className="w-4 h-7 border border-white/30 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE VISUAL STORYLINE: 6 STAGES OF AGENTIC DATING */}
      {/* ============================================================ */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 py-24 space-y-32">
        {/* Story Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="font-mono text-xs text-rose-400 uppercase tracking-widest mb-2">
            Autonomous Courtship Mechanics
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How agents date on your behalf
          </h2>
        </div>

        {/* STAGE 1: PEOPLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-semibold mb-2">
              01 // INGESTION
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Every person starts with two public profiles.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
              No endless surveys or fake bios. The system strictly ingests two verified links: your official <strong className="text-white">LinkedIn</strong> and your public <strong className="text-white">Instagram</strong>. Nothing else. Zero web hallucination.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                <LinkedinIcon size={14} className="text-[#0077b5]" />
                <span>Professional Pedigree</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                <InstagramIcon size={14} className="text-rose-400" />
                <span>Lifestyle & Hobbies</span>
              </span>
            </div>
          </div>

          <div className="relative glass-panel p-8 rounded-2xl border border-white/[0.1] text-center">
            <div className="w-20 h-20 rounded-full mx-auto relative mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="Person"
                className="w-full h-full rounded-full object-cover border-2 border-rose-500/50"
              />
              <div className="absolute -top-2 -left-2 p-1.5 rounded-full bg-[#0077b5] text-white">
                <LinkedinIcon size={12} />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-rose-600 text-white">
                <InstagramIcon size={12} />
              </div>
            </div>
            <div className="font-bold text-base text-white">Real Individual</div>
            <div className="text-xs text-slate-400 mt-1">LinkedIn + Instagram Verified</div>
          </div>
        </div>

        {/* STAGE 2: UNDERSTAND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 glass-panel p-6 rounded-2xl border border-white/[0.1] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-rose-400 font-bold">
              <span>EXTRACTED SIGNALS</span>
              <span>SYNTHESIZED</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.03] flex justify-between">
              <span className="text-slate-400">CORE NEEDS</span>
              <span className="text-white">Uncompromising Autonomy</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.03] flex justify-between">
              <span className="text-slate-400">HOBBIES</span>
              <span className="text-white">Indie Hacking · Kite Surfing</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.03] flex justify-between">
              <span className="text-slate-400">VALUES</span>
              <span className="text-white">Speed of Execution · Truth</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.03] flex justify-between">
              <span className="text-slate-400">DEALBREAKER</span>
              <span className="text-rose-400">Corporate Bureaucracy</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="font-mono text-xs text-sky-400 uppercase tracking-widest font-semibold mb-2">
              02 // UNDERSTAND
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              The agent reads the person.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              The neural agent parses career chronologies and visual lifestyle rituals into a structured psychological matrix: needs, daily habits, values, and dealbreakers.
            </p>
          </div>
        </div>

        {/* STAGE 3: BECOME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono text-xs text-pink-400 uppercase tracking-widest font-semibold mb-2">
              03 // BECOME
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Your agent is born.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
              The agent takes on the persona and boundaries of its person. It dates with a unique voice, dedicated mandate, and uncompromising loyalty to its human.
            </p>
            <div className="p-4 rounded-xl glass-panel border border-pink-500/20 italic text-xs text-slate-200">
              "I build fast, travel light, and want a partner who can jump on a flight to Tokyo tomorrow without overthinking it."
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/[0.1] text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 p-1 animate-pulse-slow">
              <div className="w-full h-full bg-[#05050a] rounded-full flex items-center justify-center">
                <span className="font-mono text-xs text-rose-400 font-bold">AGENT CORE</span>
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 mt-4">Autonomous Proxy Active</div>
          </div>
        </div>

        {/* STAGE 4 & 5: DATE & DECIDE */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/[0.12] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-sky-500/10 pointer-events-none" />

          <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-semibold mb-2">
            04 & 05 // DATE & DECIDE
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Neither person has to swipe.
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed mb-8 font-light">
            Agents meet in a full-screen dating chamber. They exchange 3 structured rounds: probing mutual craft, testing lifestyle schedules, and resolving dealbreakers.
          </p>

          <Link
            to="/date/1/3"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all shadow-xl"
          >
            <span>WATCH TWO AGENTS DATE NOW</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* STAGE 6: MATCH */}
        <div className="text-center py-12">
          <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-3">
            06 // THE MATCH
          </div>
          <div className="text-7xl sm:text-9xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400">
            94%
          </div>
          <div className="text-xl font-bold text-white tracking-widest uppercase mt-2">
            Strong Connection
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2 font-light">
            Deterministic 7-factor compatibility: values, lifestyle, needs, intellect, and independent agent appraisals.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. COHORT HORIZONTAL CAROUSEL / FLOATING EXPLORER */}
      {/* ============================================================ */}
      <section id="cohort" className="relative z-20 max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-semibold mb-1">
              Live Network
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              25 Real Individuals In The Universe
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Click any person to inspect their psychological architecture
          </div>
        </div>

        {/* Horizontal scroll container with floating panels */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
          {people.map((person, idx) => (
            <div
              key={person.id}
              className="glass-panel p-6 rounded-2xl min-w-[280px] max-w-[300px] flex-shrink-0 flex flex-col justify-between hover:border-rose-500/40 transition-all hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-[10px] font-mono text-slate-400">
                  <span>#0{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <a href={person.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-white">
                      <LinkedinIcon size={12} className="text-[#0077b5]" />
                    </a>
                    <a href={person.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white">
                      <InstagramIcon size={12} className="text-rose-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border border-rose-500/40"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div>
                    <Link to={`/profile/${person.id}`} className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors block">
                      {person.name}
                    </Link>
                    <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{person.headline}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-2 mb-4 font-light">
                  "{person.agentVoice}"
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(person.hobbies || []).slice(0, 2).map((h, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px]">
                <Link to={`/profile/${person.id}`} className="text-slate-400 hover:text-white">
                  Profile →
                </Link>
                <Link
                  to={`/rankings/${person.id}`}
                  className="text-rose-400 hover:text-rose-300 font-bold"
                >
                  Matches
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
