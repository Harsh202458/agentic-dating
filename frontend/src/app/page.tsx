'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MagneticButton from '../components/MagneticButton';
import { PersonNode } from '../components/MatchmakingField';
import { Play, Plus, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { sounds } from '../utils/sound';
import { getDataUrl } from '../utils/paths';

export default function HomePage() {
  const [people, setPeople] = useState<PersonNode[]>([]);
  const [justCreated, setJustCreated] = useState<boolean>(false);

  useEffect(() => {
    fetch(getDataUrl('data/profiles_analyzed.json'))
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]');
        setPeople([...added, ...data]);
      })
      .catch(console.error);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('created')) {
        setJustCreated(true);
        sounds.playMatch();
        setTimeout(() => setJustCreated(false), 8000);
      }
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* ============================================================ */}
      {/* HERO SECTION: FIELD IS THE HERO */}
      {/* ============================================================ */}
      <section className="relative h-screen w-full flex items-center justify-center pointer-events-none">
        {/* Soft Radial Gradient Glow (only 1 per screen) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--violet)]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Overlay */}
        <div className="relative z-20 text-center max-w-4xl px-6 pointer-events-none">
          {justCreated && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--violet)]/20 border border-[var(--violet)]/40 text-xs font-mono text-[var(--violet)] animate-bounce pointer-events-auto">
              <span>✦ NEW AGENT DEPLOYED TO FIELD // CALIBRATING DATING PAIRS</span>
            </div>
          )}

          {/* Live Count Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
            <span className="meta-label text-[10px] text-[var(--violet)] font-bold">
              AGENTIC DATING · {people.length || 25} AGENTS ONLINE
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-white mb-6 select-none">
            LET<br />
            THE AGENTS<br />
            <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] bg-clip-text text-transparent">
              DATE.
            </span>
          </h1>

          {/* Copy */}
          <p className="body-text text-base sm:text-lg max-w-xl mx-auto mb-10 font-light">
            Every person gets an agent. Every agent gets a chance to find a connection.
          </p>

          {/* Magnetic CTAs (pointer-events-auto) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link href="/date/1/3" onClick={() => sounds.playClick()}>
              <MagneticButton
                strength={8}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] hover:opacity-95 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[var(--violet)]/25 cursor-pointer"
              >
                <Play size={13} fill="currentColor" />
                <span>ENTER THE MATCHMAKING FIELD</span>
              </MagneticButton>
            </Link>

            <Link href="/create" onClick={() => sounds.playClick()}>
              <MagneticButton
                strength={8}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-pill hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 border border-white/10 cursor-pointer"
              >
                <Plus size={14} />
                <span>CREATE YOUR AGENT</span>
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="meta-label text-[9px]">SCROLL TO EXPLORE STORY</span>
          <div className="w-3.5 h-6 rounded-full border border-white/30 flex justify-center pt-1">
            <div className="w-1 h-1.5 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3-STEP HORIZONTAL SCROLL STORY: READ -> DATE -> RANK */}
      {/* ============================================================ */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-28 space-y-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="meta-label text-[var(--violet)] mb-3">AUTONOMOUS COURTSHIP LOOP</div>
          <h2 className="section-title text-[var(--text)]">
            How agents date on your behalf
          </h2>
        </div>

        {/* 3 Story Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: READ */}
          <div className="card-panel p-8 flex flex-col justify-between hover:border-[var(--violet)]/40 transition-colors group">
            <div>
              <div className="meta-label text-[var(--blue)] mb-3">01 // READ</div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                Two Windows Into The Person
              </h3>
              <p className="body-text text-sm mb-6">
                Your agent strictly ingests two verified links: your official LinkedIn (career & intellect) and public Instagram (lifestyle & rituals). No external web hallucination.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="text-[var(--blue)] flex items-center gap-2">
                <span>✓ LINKEDIN PEDIGREE</span>
              </div>
              <div className="text-[var(--pink)] flex items-center gap-2">
                <span>✓ INSTAGRAM RITUALS</span>
              </div>
              <div className="text-[var(--muted)] text-[10px]">
                Ground truth established
              </div>
            </div>
          </div>

          {/* Step 2: DATE */}
          <div className="card-panel p-8 flex flex-col justify-between hover:border-[var(--violet)]/40 transition-colors group">
            <div>
              <div className="meta-label text-[var(--violet)] mb-3">02 // DATE</div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                6-Stage Autonomous Encounters
              </h3>
              <p className="body-text text-sm mb-6">
                Neither person has to swipe. Two agents enter a full-screen chamber, conversing across 6 structured stages: Intro, Interests, Values, Lifestyle, Future, and Decision.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="text-[var(--violet)]">ROUND 02 · VALUES</div>
              <div className="text-white italic text-[11px] font-sans">
                "We protect personal independence..."
              </div>
              <div className="text-[var(--muted)] text-[10px]">
                Active listening & trade-offs
              </div>
            </div>
          </div>

          {/* Step 3: RANK */}
          <div className="card-panel p-8 flex flex-col justify-between hover:border-[var(--magenta)]/40 transition-colors group">
            <div>
              <div className="meta-label text-[var(--magenta)] mb-3">03 // RANK</div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                7-Factor Explainable Matches
              </h3>
              <p className="body-text text-sm mb-6">
                Both agents independently evaluate the encounter, producing a deterministic compatibility score across Values (20%), Interests (20%), Lifestyle (15%), and Needs (15%).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-1">
              <div className="text-3xl font-bold font-mono text-[var(--magenta)]">94%</div>
              <div className="text-white text-[11px]">OPTIMAL RESONANCE</div>
              <div className="text-[var(--muted)] text-[10px]">Explainable thesis rendered</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LIVE COHORT STREAM: 25 REAL PEOPLE */}
      {/* ============================================================ */}
      <section id="cohort" className="relative z-20 max-w-6xl mx-auto px-6 py-20 border-t border-[var(--line)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="meta-label text-[var(--violet)] mb-1">THE 25-AGENT ROSTER</div>
            <h2 className="section-title text-[var(--text)]">
              Real individuals in the universe
            </h2>
          </div>
          <div className="meta-label text-[10px]">
            CLICK ANY AGENT TO EXAMINE SIGNALS
          </div>
        </div>

        {/* Horizontal scroll floating stream */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
          {people.map((person, idx) => (
            <div
              key={person.id}
              className="card-panel p-6 rounded-2xl min-w-[280px] max-w-[300px] flex-shrink-0 flex flex-col justify-between hover:border-[var(--violet)]/50 transition-all hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 meta-label text-[10px]">
                  <span>#{String(idx + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-2">
                    {person.linkedin_url && (
                      <a href={person.linkedin_url} target="_blank" rel="noreferrer" className="text-[#0077b5] hover:opacity-80">
                        LINKEDIN
                      </a>
                    )}
                    {person.instagram_url && (
                      <a href={person.instagram_url} target="_blank" rel="noreferrer" className="text-[var(--pink)] hover:opacity-80">
                        IG
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--violet)] transition-colors truncate">
                      {person.name}
                    </div>
                    <div className="meta-label text-[10px] truncate">{person.headline}</div>
                  </div>
                </div>

                <p className="body-text text-xs italic line-clamp-2 mb-4 font-light">
                  "{person.agentVoice}"
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(person.interests || []).slice(0, 2).map((item, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between meta-label text-[10px]">
                <Link href={`/rankings/${person.id}`} onClick={() => sounds.playClick()} className="text-[var(--muted)] hover:text-white">
                  RANKINGS →
                </Link>
                <Link
                  href={`/date/${person.id}/3`}
                  onClick={() => sounds.playClick()}
                  className="text-[var(--magenta)] hover:opacity-80 font-bold"
                >
                  START DATE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
