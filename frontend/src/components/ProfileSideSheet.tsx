'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Play, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { PersonNode } from './MatchmakingField';
import { sounds } from '../utils/sound';

interface ProfileSideSheetProps {
  person: PersonNode | null;
  onClose: () => void;
  allPeople: PersonNode[];
}

export default function ProfileSideSheet({ person, onClose, allPeople }: ProfileSideSheetProps) {
  const [activeSignalTrace, setActiveSignalTrace] = useState<{
    source: string;
    signal: string;
    inference: string;
    confidence: 'High' | 'Med' | 'Low';
  } | null>(null);

  if (!person) return null;

  const samplePartner = allPeople.find(p => p.id !== person.id) || allPeople[0];

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
    <>
      {/* Click-away backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Top Bar */}
      <div className="p-6 border-b border-[var(--line)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-pulse" />
          <span className="meta-label text-[var(--violet)]">INTELLIGENCE DOSSIER // AGENT ACTIVE</span>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
        {/* Header Hero Area */}
        <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-[var(--line)]">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] animate-pulse-slow">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)]">
              {person.name}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1 leading-snug">
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

        {/* The Person Summary */}
        <div>
          <div className="meta-label mb-2">THE PERSON</div>
          <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            {person.summary || `${person.name} is a high-agency individual operating with focused dedication. The agent represents their sovereign boundaries, testing intellectual curiosity and lifestyle resonance.`}
          </p>
        </div>

        {/* Agent Mandate Voice */}
        <div className="card-panel-elevated p-4 border border-[var(--violet)]/30 relative">
          <div className="meta-label text-[10px] text-[var(--violet)] mb-1">AGENT DATING MANDATE</div>
          <p className="text-sm text-[var(--text)] italic font-light">
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
            <div className="text-xs font-mono text-[var(--text)]">
              {activeSignalTrace.source} → {activeSignalTrace.signal}
            </div>
            <div className="text-xs text-[var(--muted)]">
              {activeSignalTrace.inference}
            </div>
          </div>
        )}

        {/* Modular Signal Bento */}
        <div className="space-y-6">
          {/* Interests & Career */}
          <div>
            <div className="meta-label mb-3">INTERESTS & CAREER THEMES (CLICK TO REVEAL TRACE)</div>
            <div className="flex flex-wrap gap-2">
              {(person.interests || ['Artificial Intelligence', 'Architecture', 'Philosophy']).map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSignalClick(item, 'interest')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[var(--text)] transition-colors cursor-pointer"
                >
                  ✦ {item}
                </button>
              ))}
            </div>
          </div>

          {/* Hobbies & Lifestyle */}
          <div>
            <div className="meta-label mb-3">LIFESTYLE & HOBBIES (INSTAGRAM VERIFIED)</div>
            <div className="flex flex-wrap gap-2">
              {(person.hobbies || ['Urban Cycling', 'Reading', 'Kite Surfing']).map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSignalClick(item, 'hobby')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[var(--text)] transition-colors cursor-pointer"
                >
                  ● {item}
                </button>
              ))}
            </div>
          </div>

          {/* Values & Relationship Needs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-panel p-4">
              <div className="meta-label text-[10px] text-[var(--blue)] mb-2">CORE VALUES</div>
              <ul className="space-y-1.5 text-xs text-[var(--text)] font-mono">
                {(person.values || ['Truth', 'Autonomy', 'Transparency']).map((val, i) => (
                  <li key={i}>• {val}</li>
                ))}
              </ul>
            </div>

            <div className="card-panel p-4">
              <div className="meta-label text-[10px] text-[var(--magenta)] mb-2">RELATIONSHIP NEEDS</div>
              <ul className="space-y-1.5 text-xs text-[var(--text)] font-mono">
                {(person.needs || ['Location independence', 'Low drama', 'Intellectual depth']).map((need, i) => (
                  <li key={i}>• {need}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Non-Negotiables & Dealbreakers */}
          <div className="card-panel p-4 border border-rose-500/20">
            <div className="meta-label text-[10px] text-rose-400 mb-2">POTENTIAL FRICTION & DEALBREAKERS</div>
            <ul className="space-y-1.5 text-xs text-rose-200/80 font-mono">
              {(person.dealbreakers || ['Corporate bureaucracy', 'Passive aggression', 'Lack of ambition']).map((db, i) => (
                <li key={i}>✕ {db}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Actions */}
      <div className="p-6 border-t border-[var(--line)] bg-[var(--surface-2)] flex items-center justify-between gap-4 shrink-0">
        <Link
          href={`/date/${person.id}/${samplePartner?.id}`}
          onClick={() => sounds.playClick()}
          className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
        >
          <Play size={13} fill="currentColor" />
          <span>START DATING ENCOUNTER</span>
        </Link>

        <Link
          href={`/rankings/${person.id}`}
          onClick={() => sounds.playClick()}
          className="px-6 py-3.5 rounded-full glass-pill text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <span>RANKINGS</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  </>
);
}
