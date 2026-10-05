'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, Heart, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/sound';
import { PersonNode } from './MatchmakingField';

interface ChooseDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPeople: PersonNode[];
  matchesData?: any;
  onOpenPairPicker?: (personA?: PersonNode | null) => void;
}

export default function ChooseDateModal({
  isOpen,
  onClose,
  allPeople,
  matchesData,
  onOpenPairPicker
}: ChooseDateModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('1');

  // Filtered list of all 25 people
  const filteredPeople = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allPeople;
    return allPeople.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.headline && p.headline.toLowerCase().includes(q)) ||
      (p.gender && p.gender.toLowerCase().includes(q))
    );
  }, [allPeople, searchQuery]);

  // Selected person
  const selectedPerson = useMemo(() => {
    return allPeople.find(p => String(p.id) === String(selectedPersonId)) || allPeople[0] || null;
  }, [allPeople, selectedPersonId]);

  // All dates that the selected person has had
  const personDates = useMemo(() => {
    if (!selectedPerson) return [];

    const datesList: {
      partner: PersonNode;
      score: number;
      reason: string;
      isCustom?: boolean;
    }[] = [];

    // 1. Static matches from matches.json
    const pId = String(selectedPerson.id);
    const targetMap = matchesData?.[pId] || {};

    allPeople.forEach(other => {
      const otherId = String(other.id);
      if (otherId === pId) return;

      const match = targetMap[otherId] || matchesData?.[otherId]?.[pId];
      if (match) {
        datesList.push({
          partner: other,
          score: match.compatibilityScore || match.score || 78,
          reason: match.matchReason || match.reason || 'Compatibility encounter simulated.',
          isCustom: false
        });
      }
    });

    // 2. Custom matches from localStorage
    if (typeof window !== 'undefined') {
      try {
        const customMatches = JSON.parse(localStorage.getItem('custom_matches') || '{}');
        Object.entries(customMatches).forEach(([key, customMatch]: [string, any]) => {
          const parts = key.split('_');
          if (parts.length === 2) {
            const [candA, candB] = parts;
            if (candA === pId || candB === pId) {
              const partnerId = candA === pId ? candB : candA;
              const partner = allPeople.find(p => String(p.id) === partnerId);
              if (partner && !datesList.some(d => String(d.partner.id) === partnerId)) {
                datesList.push({
                  partner,
                  score: customMatch.compatibilityScore || customMatch.score || 85,
                  reason: customMatch.matchReason || 'Simulated encounter between partners.',
                  isCustom: true
                });
              }
            }
          }
        });
      } catch (e) {
        console.error('Error reading custom matches:', e);
      }
    }

    // Sort descending by score
    return datesList.sort((a, b) => b.score - a.score);
  }, [selectedPerson, allPeople, matchesData]);

  if (!isOpen) return null;

  const handleOpenDate = (partnerId: string | number) => {
    sounds.playClick();
    onClose();
    router.push(`/dates/${selectedPerson?.id}-${partnerId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div
        className="w-full max-w-4xl max-h-[88vh] bg-[#0E0E13] border border-[var(--line)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--text)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--line)] flex items-center justify-between shrink-0 bg-[var(--surface-2)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--violet)] animate-pulse" />
            <h2 className="font-mono text-sm uppercase tracking-wider font-bold text-white">
              CHOOSE DATE // ALL 25 PARTICIPANTS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onOpenPairPicker && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onOpenPairPicker(selectedPerson);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles size={12} />
                <span>START CUSTOM PAIR DATE</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body: 2 columns on desktop */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Search & 25 People List */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[var(--line)] flex flex-col overflow-hidden bg-[var(--surface)]/50">
            {/* Search Input */}
            <div className="p-3 border-b border-[var(--line)]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search 25 people..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white placeholder-[var(--text-placeholder)] focus:outline-none focus:border-[var(--violet)]"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
              {filteredPeople.map(person => {
                const isSelected = String(person.id) === String(selectedPersonId);
                return (
                  <button
                    key={person.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPersonId(String(person.id));
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--violet)]/20 border border-[var(--violet)]/60 text-white'
                        : 'hover:bg-white/5 text-[var(--text-secondary)] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full shrink-0 ring-1 ring-white/20 overflow-hidden bg-[var(--surface-2)]">
                      <img
                        src={`/avatars/${person.id}.jpg`}
                        alt={person.name}
                        className="w-full h-full object-cover object-[center_20%]"
                        onError={(e) => {
                          // Fallback to photo or initials
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-white truncate flex items-center justify-between">
                        <span>{person.name}</span>
                        <span className="meta-label text-[9px] text-[var(--text-muted)] font-mono ml-2">
                          #{person.id}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] truncate">
                        {person.headline || 'Independent Operator'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dossier & All Dates for Selected Person */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-[#07070A]">
            {selectedPerson ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Selected Person Card Header */}
                <div className="p-4 border-b border-[var(--line)] bg-[var(--surface-2)]/60 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full ring-2 ring-[var(--violet)]/60 overflow-hidden bg-[var(--surface-2)] shrink-0">
                    <img
                      src={`/avatars/${selectedPerson.id}.jpg`}
                      alt={selectedPerson.name}
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-white truncate">
                      {selectedPerson.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      {selectedPerson.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="meta-label text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                        {selectedPerson.gender === 'female' ? 'FEMALE (F)' : 'MALE (M)'}
                      </span>
                      <span className="meta-label text-[9px] text-[var(--text-muted)] font-mono">
                        {personDates.length} COMPLETED DATES
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="meta-label text-[10px] text-[var(--text-muted)] tracking-wider">
                    COMPLETED ENCOUNTERS WITH {selectedPerson.name.toUpperCase()}
                  </div>

                  {personDates.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-[var(--text-secondary)] space-y-2">
                      <p className="text-xs">No prior date records for this person yet.</p>
                      {onOpenPairPicker && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onClose();
                            onOpenPairPicker(selectedPerson);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[var(--violet)] text-white text-xs font-mono font-bold cursor-pointer hover:brightness-110"
                        >
                          ✦ INITIATE FIRST DATE
                        </button>
                      )}
                    </div>
                  ) : (
                    personDates.map(date => (
                      <div
                        key={date.partner.id}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-[var(--line)] hover:border-[var(--violet)]/50 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-full ring-1 ring-white/20 overflow-hidden bg-[var(--surface-2)] shrink-0">
                            <img
                              src={`/avatars/${date.partner.id}.jpg`}
                              alt={date.partner.name}
                              className="w-full h-full object-cover object-[center_20%]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-white truncate">
                                {date.partner.name}
                              </span>
                              <span className="meta-label text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[var(--text-secondary)]">
                                {date.partner.gender === 'female' ? 'F' : 'M'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                              {date.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold text-[var(--magenta)]">
                              {date.score}%
                            </div>
                            <div className="meta-label text-[8px] text-[var(--text-muted)]">
                              SCORE
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenDate(date.partner.id)}
                            className="px-3 py-1.5 rounded-full bg-[var(--violet)]/20 hover:bg-[var(--violet)] border border-[var(--violet)]/40 text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer group-hover:scale-105"
                          >
                            <span>OPEN</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-[var(--text-secondary)] font-mono text-xs">
                Select a person from the list on the left to see their dates.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
