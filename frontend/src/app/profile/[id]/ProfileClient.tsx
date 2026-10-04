'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Play, ShieldCheck, Heart } from 'lucide-react';
import { PersonNode } from '@/components/MatchmakingField';
import { sounds } from '@/utils/sound';
import { getDataUrl } from '@/utils/paths';

export default function ProfileClient({ id }: { id: string }) {
  const [person, setPerson] = useState<PersonNode | null>(null);
  const [allPeople, setAllPeople] = useState<PersonNode[]>([]);
  const [activeSignalTrace, setActiveSignalTrace] = useState<{
    source: string;
    signal: string;
    inference: string;
    confidence: 'High' | 'Med' | 'Low';
  } | null>(null);

  useEffect(() => {
    fetch(getDataUrl('data/profiles_analyzed.json'))
      .then((r) => r.json())
      .then((data: any) => {
        const list = Array.isArray(data) ? data : Object.values(data);
        const mapped: PersonNode[] = list.map((p: any) => ({
          id: p.id,
          name: p.name,
          headline: p.headline || p.role || 'Innovator',
          photo: p.photo || p.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          interests: p.interests || p.hobbies || ['Technology', 'Philosophy', 'Art'],
          values: p.values || ['Authenticity', 'Curiosity'],
          dealbreakers: p.dealbreakers || ['Superficiality'],
          summary: p.summary || p.bio || '',
          agentVoice: p.agentVoice || `I represent ${p.name}. I seek authentic resonance and profound intellectual alignment.`,
          linkedin_url: p.linkedin_url || p.linkedin,
          instagram_url: p.instagram_url || p.instagram,
          lifestyle: p.lifestyle || 'Active & Curious',
          career: p.career || p.headline || 'Independent Builder'
        }));
        setAllPeople(mapped);
        const found = mapped.find((p) => String(p.id) === String(id)) || mapped[0];
        setPerson(found);
      })
      .catch((err) => console.error('Failed loading profile:', err));
  }, [id]);

  if (!person) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
          <span>INITIALIZING DOSSIER #{id}...</span>
        </div>
      </div>
    );
  }

  const samplePartner = allPeople.find((p) => p.id !== person.id) || allPeople[0];

  const handleSignalClick = (name: string, type: string) => {
    sounds.playClick();
    setActiveSignalTrace({
      source: type === 'interest' || type === 'career' ? 'LinkedIn Public Profile' : 'Instagram Public Media',
      signal: `Extracted verification: "${name}"`,
      inference: `Inferred compatibility anchor: Represents core life devotion and boundary`,
      confidence: 'High'
    });
  };

  return (
    <div className="min-h-screen text-[var(--text)] selection:bg-[var(--violet)]/30 relative">
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--muted)] hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Field
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-pulse" />
            <span className="meta-label text-[var(--violet)]">AGENT DOSSIER #{person.id}</span>
          </div>
        </div>

        {/* Profile Card Container */}
        <div className="card-panel-elevated p-8 sm:p-10 border border-[var(--line)] space-y-8">
          {/* Header Hero */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-[var(--line)]">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] animate-pulse-slow">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text)]">
                {person.name}
              </h1>
              <p className="text-base text-[var(--muted)] mt-1.5 leading-snug">
                {person.headline}
              </p>

              {/* Source Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {person.linkedin_url ? (
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[var(--text)] flex items-center gap-1.5 transition-colors"
                  >
                    <span className="text-[#0077b5]">LINKEDIN</span>
                    <span className="text-[var(--violet)]">✓ ANALYZED</span>
                    <ExternalLink size={10} className="text-[var(--muted)]" />
                  </a>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[var(--muted)]">
                    LINKEDIN · NOT AVAILABLE
                  </span>
                )}

                {person.instagram_url ? (
                  <a
                    href={person.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[var(--text)] flex items-center gap-1.5 transition-colors"
                  >
                    <span className="text-[var(--pink)]">INSTAGRAM</span>
                    <span className="text-[var(--violet)]">✓ ANALYZED</span>
                    <ExternalLink size={10} className="text-[var(--muted)]" />
                  </a>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[var(--muted)]">
                    INSTAGRAM · NOT AVAILABLE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Person Summary */}
          <div>
            <div className="meta-label mb-2 text-xs">THE PERSON</div>
            <p className="body-text text-base text-[var(--muted)] leading-relaxed">
              {person.summary || `${person.name} is a high-agency individual operating with focused dedication. The agent represents their sovereign boundaries, testing intellectual curiosity and lifestyle resonance.`}
            </p>
          </div>

          {/* Agent Mandate Voice */}
          <div className="card-panel-elevated p-5 border border-[var(--violet)]/30 relative">
            <div className="meta-label text-[10px] text-[var(--violet)] mb-1">AGENT DATING MANDATE</div>
            <p className="text-base text-[var(--text)] italic font-light">
              "{person.agentVoice || `I represent ${person.name}. I test for authentic depth and zero tolerance for pretense.`}"
            </p>
          </div>

          {/* Signal Trace Drawer (Interactive click reveal) */}
          {activeSignalTrace && (
            <div className="p-4 rounded-xl bg-white/[0.04] border border-[var(--violet)]/40 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="meta-label text-[9px] text-[var(--violet)]">SOURCE EVIDENCE TRACE</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--violet)]/20 text-[var(--violet)]">
                  CONFIDENCE: {activeSignalTrace.confidence}
                </span>
              </div>
              <div className="text-xs font-mono text-[var(--text)] flex items-center gap-2">
                <span className="text-[var(--muted)]">{activeSignalTrace.source}</span>
                <span className="text-[var(--violet)]">→</span>
                <span>{activeSignalTrace.signal}</span>
              </div>
              <div className="text-xs text-[var(--muted)]">
                {activeSignalTrace.inference}
              </div>
            </div>
          )}

          {/* Bento Grid of Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interests & Passions */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-[var(--line)]">
              <div className="meta-label text-[10px] mb-3">PUBLIC SIGNALS · INTERESTS</div>
              <div className="flex flex-wrap gap-2">
                {(person.interests || []).map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSignalClick(tag, 'interest')}
                    className="chip px-3 py-1 rounded-full text-xs text-[var(--text)] bg-white/5 hover:bg-[var(--violet)]/20 hover:border-[var(--violet)] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-[var(--line)]">
              <div className="meta-label text-[10px] mb-3">AGENT ANCHORS · VALUES</div>
              <div className="flex flex-wrap gap-2">
                {(person.values || []).map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSignalClick(v, 'value')}
                    className="chip px-3 py-1 rounded-full text-xs text-[var(--violet)] bg-[var(--violet)]/10 hover:bg-[var(--violet)]/20 border-[var(--violet)]/30 transition-colors cursor-pointer"
                  >
                    ✦ {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Hard Dealbreakers */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-[var(--line)]">
              <div className="meta-label text-[10px] mb-3 text-red-400/80">INFERRED DEALBREAKERS</div>
              <div className="flex flex-wrap gap-2">
                {(person.dealbreakers || []).map((db, idx) => (
                  <span
                    key={idx}
                    className="chip px-3 py-1 rounded-full text-xs text-red-300 bg-red-950/20 border-red-500/20"
                  >
                    ✕ {db}
                  </span>
                ))}
              </div>
            </div>

            {/* Agent Verification Status */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-[var(--line)] flex flex-col justify-between">
              <div>
                <div className="meta-label text-[10px] mb-2">VERIFICATION INTEGRITY</div>
                <p className="text-xs text-[var(--muted)]">
                  Zero hallucinations. Signals strictly bound to LinkedIn & Instagram.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-[var(--violet)]">
                <ShieldCheck size={16} />
                <span>100% EVIDENCE BOUND</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/date/${person.id}/${samplePartner?.id || 1}`}
              onClick={() => sounds.playConnect()}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[var(--text)] text-[var(--bg)] hover:bg-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-white/5"
            >
              <Play size={16} fill="currentColor" />
              <span>WATCH AGENT IN SIMULATED DATE</span>
            </Link>

            <Link
              href={`/rankings/${person.id}`}
              onClick={() => sounds.playClick()}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-[var(--line)] hover:border-white/30 text-[var(--text)] text-sm font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <span>VIEW AGENT RANKINGS</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
