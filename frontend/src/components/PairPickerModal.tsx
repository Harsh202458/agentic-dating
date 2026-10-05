'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeftRight, Search, Heart, Sparkles, User, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { PersonNode } from './MatchmakingField';
import SocialBadges from './SocialBadges';
import { isPairEligible } from '../utils/matching';
import { sounds } from '../utils/sound';

interface PairPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPeople: PersonNode[];
  initialAgentA?: PersonNode | null;
  initialAgentB?: PersonNode | null;
}

export default function PairPickerModal({
  isOpen,
  onClose,
  allPeople,
  initialAgentA,
  initialAgentB
}: PairPickerModalProps) {
  const router = useRouter();

  // Combine demo candidates with any user-created agents in localStorage
  const fullCandidatesList = useMemo(() => {
    if (typeof window !== 'undefined') {
      const added: PersonNode[] = JSON.parse(localStorage.getItem('added_people') || '[]');
      const ids = new Set(added.map(a => String(a.id)));
      const filteredOriginals = allPeople.filter(p => !ids.has(String(p.id)));
      return [...added, ...filteredOriginals];
    }
    return allPeople;
  }, [allPeople]);

  const [agentA, setAgentA] = useState<PersonNode | null>(initialAgentA || fullCandidatesList[0] || null);
  const [agentB, setAgentB] = useState<PersonNode | null>(initialAgentB || fullCandidatesList[13] || null);

  useEffect(() => {
    if (initialAgentA) setAgentA(initialAgentA);
    if (initialAgentB) setAgentB(initialAgentB);
  }, [initialAgentA, initialAgentB, isOpen]);

  const [activeSlot, setActiveSlot] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter candidates for search
  const filteredCandidates = fullCandidatesList.filter(p => {
    const q = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q);
    const headlineMatch = (p.headline || '').toLowerCase().includes(q);
    const interestsMatch = (p.interests || []).some(i => i.toLowerCase().includes(q));
    return nameMatch || headlineMatch || interestsMatch;
  });

  const isSamePerson = Boolean(agentA && agentB && String(agentA.id) === String(agentB.id));
  const isOutsideDefaultPreference = Boolean(agentA && agentB && !isPairEligible(agentA, agentB) && !isSamePerson);

  const handleSwap = () => {
    sounds.playClick();
    const temp = agentA;
    setAgentA(agentB);
    setAgentB(temp);
  };

  const handleSelectCandidate = (candidate: PersonNode) => {
    sounds.playClick();
    if (activeSlot === 'A') {
      setAgentA(candidate);
    } else if (activeSlot === 'B') {
      setAgentB(candidate);
    }
    setActiveSlot(null);
    setSearchQuery('');
  };

  const handleStartDate = () => {
    if (!agentA || !agentB || isSamePerson) return;
    sounds.playConnect();
    onClose();
    router.push(`/date/${agentA.id}/${agentB.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="card-panel-elevated w-full max-w-3xl border border-[var(--violet)]/40 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh] bg-[var(--surface)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--line)] flex items-center justify-between shrink-0 bg-[var(--surface-2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--violet)] to-[var(--magenta)] flex items-center justify-center text-white font-bold text-xs">
              ✦
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                MANUAL MATCHMAKER // DATE ANY TWO AGENTS
              </h2>
              <p className="meta-label text-[9px] text-[var(--text-secondary)]">
                SELECT ANY TWO CANDIDATES ACROSS THE 25-AGENT ROSTER + USER CREATIONS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Two Slots & Swap Controller */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Slot A */}
            <div className="md:col-span-5 card-panel p-5 border border-white/10 hover:border-[var(--violet)]/50 transition-all rounded-xl bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="meta-label text-[10px] text-[var(--violet)] font-bold">
                  SLOT A // FIRST AGENT
                </span>
                {agentA && (
                  <span className="meta-label text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    {agentA.gender === 'female' ? 'FEMALE (F)' : 'MALE (M)'}
                  </span>
                )}
              </div>

              {agentA ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={agentA.photo}
                      alt={agentA.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[var(--violet)] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-base text-[var(--text)] truncate">{agentA.name}</div>
                      <div className="meta-label text-[10px] text-[var(--text-secondary)] truncate">{agentA.headline}</div>
                    </div>
                  </div>

                  <SocialBadges linkedinUrl={agentA.linkedin_url} instagramUrl={agentA.instagram_url} size="sm" />

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveSlot('A');
                      setSearchQuery('');
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 meta-label text-[10px] text-[var(--text)] transition-colors cursor-pointer"
                  >
                    CHANGE AGENT A
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveSlot('A');
                    setSearchQuery('');
                  }}
                  className="w-full py-8 border-2 border-dashed border-white/15 rounded-xl hover:border-[var(--violet)]/50 text-[var(--text-secondary)] hover:text-white meta-label text-xs flex flex-col items-center gap-2 transition-all cursor-pointer"
                >
                  <User size={20} />
                  <span>+ SELECT AGENT A</span>
                </button>
              )}
            </div>

            {/* Swap Button Controller */}
            <div className="md:col-span-1 flex justify-center py-2 md:py-0">
              <button
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[var(--text)] hover:text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
                title="Swap Agent A and Agent B"
                aria-label="Swap agents"
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>

            {/* Slot B */}
            <div className="md:col-span-5 card-panel p-5 border border-white/10 hover:border-[var(--magenta)]/50 transition-all rounded-xl bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="meta-label text-[10px] text-[var(--magenta)] font-bold">
                  SLOT B // SECOND AGENT
                </span>
                {agentB && (
                  <span className="meta-label text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    {agentB.gender === 'female' ? 'FEMALE (F)' : 'MALE (M)'}
                  </span>
                )}
              </div>

              {agentB ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={agentB.photo}
                      alt={agentB.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[var(--magenta)] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-base text-[var(--text)] truncate">{agentB.name}</div>
                      <div className="meta-label text-[10px] text-[var(--text-secondary)] truncate">{agentB.headline}</div>
                    </div>
                  </div>

                  <SocialBadges linkedinUrl={agentB.linkedin_url} instagramUrl={agentB.instagram_url} size="sm" />

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveSlot('B');
                      setSearchQuery('');
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 meta-label text-[10px] text-[var(--text)] transition-colors cursor-pointer"
                  >
                    CHANGE AGENT B
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveSlot('B');
                    setSearchQuery('');
                  }}
                  className="w-full py-8 border-2 border-dashed border-white/15 rounded-xl hover:border-[var(--magenta)]/50 text-[var(--text-secondary)] hover:text-white meta-label text-xs flex flex-col items-center gap-2 transition-all cursor-pointer"
                >
                  <User size={20} />
                  <span>+ SELECT AGENT B</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Notice 1: Same Person Blocked */}
          {isSamePerson && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5 animate-fade-in">
              <AlertCircle size={15} className="shrink-0" />
              <span>Cannot date the same person. Please pick two different candidates for Slot A and Slot B.</span>
            </div>
          )}

          {/* Validation Notice 2: Non-blocking Preference Note */}
          {isOutsideDefaultPreference && (
            <div className="p-3.5 rounded-xl bg-[var(--violet)]/15 border border-[var(--violet)]/30 text-[var(--text)] text-xs font-mono flex items-center gap-2.5 animate-fade-in">
              <Info size={15} className="shrink-0 text-[var(--violet)]" />
              <span>
                Outside default preferences, compatibility is scored honestly. (Manual pairing allows any combination).
              </span>
            </div>
          )}

          {/* Candidate Selection Drawer / List when activeSlot is set */}
          {activeSlot && (
            <div className="card-panel-elevated p-4 border border-[var(--violet)]/40 rounded-xl space-y-3 animate-fade-in bg-[var(--surface-2)]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="meta-label text-[10px] text-[var(--violet)] font-bold">
                  CHOOSE FOR SLOT {activeSlot} ({fullCandidatesList.length} AVAILABLE CANDIDATES)
                </span>
                <button
                  onClick={() => setActiveSlot(null)}
                  className="meta-label text-[9px] text-[var(--text-secondary)] hover:text-white"
                >
                  CANCEL
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, headline, or craft..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-[var(--text-placeholder)] text-xs font-mono focus:border-[var(--violet)] outline-none"
                  autoFocus
                />
              </div>

              {/* Scrollable Roster */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredCandidates.map((candidate) => {
                  const isCurrentSlot =
                    (activeSlot === 'A' && String(agentA?.id) === String(candidate.id)) ||
                    (activeSlot === 'B' && String(agentB?.id) === String(candidate.id));
                  const isOtherSlot =
                    (activeSlot === 'A' && String(agentB?.id) === String(candidate.id)) ||
                    (activeSlot === 'B' && String(agentA?.id) === String(candidate.id));

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => handleSelectCandidate(candidate)}
                      className={`p-3 rounded-lg flex items-center justify-between gap-3 border transition-all cursor-pointer ${
                        isCurrentSlot
                          ? 'bg-[var(--violet)]/20 border-[var(--violet)]'
                          : isOtherSlot
                          ? 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                          : 'bg-white/[0.04] border-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={candidate.photo}
                          alt={candidate.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-white truncate flex items-center gap-2">
                            <span>{candidate.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[var(--text-secondary)]">
                              {candidate.gender === 'female' ? 'F' : 'M'}
                            </span>
                          </div>
                          <div className="meta-label text-[9px] text-[var(--text-secondary)] truncate">
                            {candidate.headline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <SocialBadges
                          linkedinUrl={candidate.linkedin_url}
                          instagramUrl={candidate.instagram_url}
                          size="sm"
                          showHandles={false}
                        />
                        <span className="meta-label text-[9px] text-[var(--magenta)] font-bold px-2 py-1 rounded bg-white/5">
                          SELECT →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[var(--line)] bg-[var(--surface-2)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="meta-label text-[9px] text-[var(--text-secondary)]">
            CACHED BY UNORDERED PAIR // REAL MULTI-ROUND EVALUATION
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-white/15 meta-label text-[10px] text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
            >
              CLOSE
            </button>

            <button
              onClick={handleStartDate}
              disabled={!agentA || !agentB || isSamePerson}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full !text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                !agentA || !agentB || isSamePerson
                  ? 'bg-white/10 text-white/30 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] hover:opacity-95 cursor-pointer shadow-[var(--violet)]/25'
              }`}
            >
              <Heart size={14} fill="currentColor" />
              <span>START DATE →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
