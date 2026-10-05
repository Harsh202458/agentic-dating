'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Users
} from 'lucide-react';
import { sounds } from '../../../../utils/sound';
import { getDataUrl } from '../../../../utils/paths';
import { isEligiblePair } from '../../../../utils/matching';
import SocialBadges from '../../../../components/SocialBadges';
import ChooseDateModal from '../../../../components/ChooseDateModal';
import { usePairPicker } from '../../../../components/AppWrapper';

interface Turn {
  speaker: 'A' | 'B';
  message: string;
  thought: string;
  signals?: string[];
}

const STAGES = [
  { id: '01', title: 'INTRO', desc: 'First Impressions' },
  { id: '02', title: 'INTERESTS', desc: 'Craft & Focus' },
  { id: '03', title: 'VALUES', desc: 'Moral Axioms' },
  { id: '04', title: 'LIFESTYLE', desc: 'Daily Cadence' },
  { id: '05', title: 'FUTURE', desc: 'Dealbreakers' },
  { id: '06', title: 'DECISION', desc: 'Mutual Verdict' }
];

export default function DateArenaClient({ id1, id2 }: { id1: string; id2: string }) {
  const router = useRouter();
  const { openPairPicker } = usePairPicker();

  const [personA, setPersonA] = useState<any>(null);
  const [personB, setPersonB] = useState<any>(null);
  const [allPeople, setAllPeople] = useState<any[]>([]);
  const [matchesData, setMatchesData] = useState<any>(null);

  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [scoreCounter, setScoreCounter] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(85);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Searchable panel of all 25 people modal state
  const [isChooseDateModalOpen, setIsChooseDateModalOpen] = useState<boolean>(false);

  // Data-driven Recent / Top dates list
  const [recentPairs, setRecentPairs] = useState<{ id1: string; id2: string; label: string; score?: number }[]>([]);

  // Avatar error fallback states
  const [avatarErrorA, setAvatarErrorA] = useState<boolean>(false);
  const [avatarErrorB, setAvatarErrorB] = useState<boolean>(false);

  // Message container ref for auto-scrolling
  const messageCardRef = useRef<HTMLDivElement | null>(null);

  // Sync URL to canonical /dates/<idA>-<idB> without reloading
  useEffect(() => {
    if (typeof window !== 'undefined' && id1 && id2) {
      const canonicalPath = `/dates/${id1}-${id2}`;
      if (window.location.pathname !== canonicalPath && !window.location.pathname.startsWith('/dates/')) {
        window.history.replaceState(null, '', canonicalPath);
      }
    }
  }, [id1, id2]);

  // Clean fallback turns builder (zero template jargon, natural conversation)
  const buildTurnsFromMatch = (match: any, pA: any, pB: any): Turn[] => {
    if (match?.conversation && match.conversation.length >= 6) {
      return match.conversation.map((c: any, idx: number) => ({
        speaker: c.agent === 'A' ? 'A' : 'B',
        message: c.message,
        thought: c.thought || (idx % 2 === 0
          ? `Evaluating ${pB.name}'s lifestyle, cadence, and shared values.`
          : `Considering ${pA.name}'s focus, ambition, and emotional presence.`),
        signals: idx === 0 ? ['Warmth', 'First Impressions']
               : idx === 1 ? ['Curiosity', 'Active Listening']
               : idx === 2 ? ['Shared Values', 'Trust']
               : idx === 3 ? ['Daily Rhythm', 'Mutual Support']
               : idx === 4 ? ['Clear Boundaries', 'Emotional Maturity']
               : ['Mutual Resonance', 'Positive Verdict']
      }));
    }

    const intA = pA.interests?.[0] || 'creative work';
    const intB = pB.interests?.[0] || 'meaningful projects';
    const valA = pA.values?.[0] || 'curiosity';
    const valB = pB.values?.[0] || 'authenticity';

    return [
      {
        speaker: 'A',
        thought: `Introducing ${pA.name} and initiating an open, warm conversation.`,
        message: `Hello! I am speaking on behalf of ${pA.name}. Most of their days revolve around ${intA}, but they care deeply about genuine connections and shared humor. What does a typical week look like for you, and what gives you the most joy lately?`,
        signals: ['Warmth', 'Opening Chemistry']
      },
      {
        speaker: 'B',
        thought: `Responding warmly on behalf of ${pB.name} and exploring common interests.`,
        message: `Hi there! For ${pB.name}, life centers on ${intB} and continuous learning. They love building things with intention, but winding down with honest conversation and laughter is just as important. When you step away from work, what kind of experiences do you look forward to?`,
        signals: ['Creative Drive', 'Balanced Living']
      },
      {
        speaker: 'A',
        thought: `Discussing foundational values like ${valA} and mutual independence.`,
        message: `For ${pA.name}, a strong relationship is built on ${valA} and mutual independence—cheering each other on while having complete trust. In long-term connections, what values do you treat as non-negotiable?`,
        signals: ['Independence', 'Trust']
      },
      {
        speaker: 'B',
        thought: `Affirming alignment on ${valB} and daily habits.`,
        message: `That aligns closely with ${pB.name}'s view. Their foundation is ${valB} and emotional maturity. Being with someone who understands high dedication without resentment makes all the difference. How do you protect quality time together?`,
        signals: ['Emotional Maturity', 'Quality Time']
      },
      {
        speaker: 'A',
        thought: `Addressing direct communication and navigating conflict.`,
        message: `If disagreements happen, ${pA.name} believes in calm, face-to-face communication over letting tension simmer. Life is too short for passive-aggressive games. How do you navigate tough conversations?`,
        signals: ['Direct Honesty', 'Calm Communication']
      },
      {
        speaker: 'B',
        thought: `Synthesizing mutual fit and delivering positive verdict.`,
        message: `With complete openness and empathy. Based on everything we have shared, there is a natural rhythm and genuine mutual respect between ${pA.name} and ${pB.name} that would be exciting to explore in person.`,
        signals: ['Calm Empathy', 'Mutual Synthesis']
      }
    ];
  };

  const loadOrSimulateDate = useCallback(async (pA: any, pB: any, matchData: any) => {
    // Unordered pair key (sorted IDs)
    const pairKey = [String(pA.id), String(pB.id)].sort().join('_');
    const customMatches = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('custom_matches') || '{}') : {};

    // 1. Check Cache: custom matches or static demo matches
    const cached = customMatches[pairKey] || matchData?.[pA.id]?.[pB.id] || matchData?.[pB.id]?.[pA.id];

    if (cached) {
      setMatchDetails(cached);
      const score = cached.compatibilityScore || cached.score || 85;
      setTargetScore(score);
      const generated = buildTurnsFromMatch(cached, pA, pB);
      setTurns(generated);
      setCurrentTurnIdx(0);
      setIsSimulating(false);
      setSimulationError(null);
      return;
    }

    // 2. Not in Cache: Generate with real LLM endpoint
    setIsSimulating(true);
    setSimulationError(null);
    setTurns([]);
    setCurrentTurnIdx(-1);

    try {
      const response = await fetch('/api/simulate-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personA: pA, personB: pB })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to simulate date encounter.');
      }

      const generatedMatch = result.data;

      // Persist in localStorage by sorted pair key
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('custom_matches') || '{}');
        existing[pairKey] = generatedMatch;
        localStorage.setItem('custom_matches', JSON.stringify(existing));
      }

      setMatchDetails(generatedMatch);
      const score = generatedMatch.compatibilityScore || 85;
      setTargetScore(score);
      const generatedTurns = buildTurnsFromMatch(generatedMatch, pA, pB);
      setTurns(generatedTurns);
      setCurrentTurnIdx(0);
      setIsSimulating(false);
      sounds.playConnect();
    } catch (err: any) {
      console.error('Simulation error:', err);
      setIsSimulating(false);
      setSimulationError(err.message || 'Error occurred while simulating date.');
    }
  }, []);

  // Main data loader
  useEffect(() => {
    setAvatarErrorA(false);
    setAvatarErrorB(false);

    Promise.all([
      fetch(getDataUrl('data/profiles_analyzed.json')).then(r => r.json()),
      fetch(getDataUrl('data/matches.json')).then(r => r.json()).catch(() => null)
    ])
      .then(([data, matchData]) => {
        const added = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('added_people') || '[]') : [];
        const all = [...added, ...data];
        setAllPeople(all);
        setMatchesData(matchData);

        const pA = all.find((p: any) => String(p.id) === String(id1)) || all[0];
        let pB = all.find((p: any) => String(p.id) === String(id2));
        if (!pB || String(pB.id) === String(pA.id)) {
          pB = all.find((p: any) => String(p.id) !== String(pA.id)) || all[1];
        }

        setPersonA(pA);
        setPersonB(pB);

        // Dynamically compute Top / Recent dates from matchesData & customMatches
        const pairList: { id1: string; id2: string; label: string; score: number }[] = [];
        const seenKeys = new Set<string>();

        // 1. Ingest custom matches first (recency)
        if (typeof window !== 'undefined') {
          const customMatches = JSON.parse(localStorage.getItem('custom_matches') || '{}');
          Object.entries(customMatches).forEach(([key, cm]: [string, any]) => {
            const [cand1, cand2] = key.split('_');
            const found1 = all.find((p: any) => String(p.id) === cand1);
            const found2 = all.find((p: any) => String(p.id) === cand2);
            if (found1 && found2 && !seenKeys.has(key)) {
              seenKeys.add(key);
              pairList.push({
                id1: String(found1.id),
                id2: String(found2.id),
                label: `${found1.name.split(' ')[0]} × ${found2.name.split(' ')[0]}`,
                score: cm.compatibilityScore || cm.score || 85
              });
            }
          });
        }

        // 2. Ingest top static matches from matchesData
        if (matchData) {
          Object.entries(matchData).forEach(([candAId, targetMap]: [string, any]) => {
            Object.entries(targetMap).forEach(([candBId, match]: [string, any]) => {
              const pairKey = [candAId, candBId].sort().join('_');
              if (!seenKeys.has(pairKey)) {
                seenKeys.add(pairKey);
                const found1 = all.find((p: any) => String(p.id) === candAId);
                const found2 = all.find((p: any) => String(p.id) === candBId);
                if (found1 && found2) {
                  pairList.push({
                    id1: String(found1.id),
                    id2: String(found2.id),
                    label: `${found1.name.split(' ')[0]} × ${found2.name.split(' ')[0]}`,
                    score: match.compatibilityScore || 80
                  });
                }
              }
            });
          });
        }

        // Sort descending by score, take top 12
        pairList.sort((a, b) => b.score - a.score);
        setRecentPairs(pairList.slice(0, 12));

        loadOrSimulateDate(pA, pB, matchData);
      })
      .catch(console.error);
  }, [id1, id2, loadOrSimulateDate]);

  // Previous / Next date navigation handlers
  const navigateDate = (direction: 'prev' | 'next') => {
    if (recentPairs.length === 0) return;
    sounds.playClick();

    const currentKey = [String(id1), String(id2)].sort().join('_');
    let idx = recentPairs.findIndex(p => [p.id1, p.id2].sort().join('_') === currentKey);

    if (idx === -1) idx = 0;

    let targetIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (targetIdx < 0) targetIdx = recentPairs.length - 1;
    if (targetIdx >= recentPairs.length) targetIdx = 0;

    const nextPair = recentPairs[targetIdx];
    if (nextPair) {
      router.push(`/dates/${nextPair.id1}-${nextPair.id2}`);
    }
  };

  // Typewriter effect with full-message completion guarantee
  useEffect(() => {
    if (!isPlaying || finished || turns.length === 0 || currentTurnIdx < 0) return;

    const current = turns[currentTurnIdx];
    if (!current) return;
    const fullText = current.message;
    let charIdx = 0;
    setDisplayedText('');

    // Only auto-scroll down if past initial opening turn
    if (currentTurnIdx > 0) {
      setTimeout(() => {
        messageCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    const baseDelay = 18 / speed;
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx % 4 === 0) sounds.playClick();

      if (charIdx >= fullText.length) {
        clearInterval(interval);
        setDisplayedText(fullText); // Guarantee complete text rendering
        setTimeout(() => {
          if (currentTurnIdx < turns.length - 1) {
            setCurrentTurnIdx(prev => prev + 1);
          } else {
            setFinished(true);
            sounds.playMatch();
          }
        }, 1200 / speed);
      }
    }, baseDelay);

    return () => clearInterval(interval);
  }, [currentTurnIdx, isPlaying, speed, finished, turns]);

  // Score counter animation on finish
  useEffect(() => {
    if (!finished) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setScoreCounter(targetScore);
        clearInterval(interval);
      } else {
        setScoreCounter(current);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [finished, targetScore]);

  if (!personA || !personB) return null;

  const currentTurn = turns[currentTurnIdx];
  const activeSpeaker = currentTurn?.speaker || 'A';
  const currentStage = STAGES[Math.min(5, Math.max(0, currentTurnIdx))];
  const isOutsideDefaultPreference = !isEligiblePair(personA, personB);

  // Warmth metric (score 0-100)
  const warmth = targetScore || 85;

  return (
    <div className="fixed inset-0 z-30 bg-[#07070A] text-[#F4F4F6] flex flex-col justify-between overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--violet)]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="p-4 sm:p-5 border-b border-[var(--line)] flex items-center justify-between shrink-0 relative z-20 bg-[#0E0E13]/90 backdrop-blur-md">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="meta-label flex items-center gap-2 text-[#B4B4C0] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>EXIT CHAMBER</span>
        </Link>

        {/* 6-Step Progress Track */}
        <div className="hidden md:flex items-center gap-2">
          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentTurnIdx || finished;
            const isCurrent = idx === currentTurnIdx && !finished;

            return (
              <div key={s.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-[var(--violet)] scale-125 shadow-[0_0_10px_var(--violet)]'
                    : isCompleted
                    ? 'bg-[var(--magenta)]'
                    : 'bg-white/15'
                }`} />
                <span className={`meta-label text-[9px] ${
                  isCurrent ? 'text-[var(--violet)] font-bold' : isCompleted ? 'text-white font-bold' : 'text-[#7C7C8A]'
                }`}>
                  {s.id}
                </span>
                {idx < STAGES.length - 1 && <span className="w-3 h-px bg-white/15" />}
              </div>
            );
          })}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setIsChooseDateModalOpen(true);
            }}
            className="meta-label text-[10px] px-3 py-1.5 rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/20 text-white hover:bg-[var(--violet)]/35 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Browse all 25 people and their dates"
          >
            <Users size={12} className="text-[var(--magenta)]" />
            <span>CHOOSE DATE</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              openPairPicker(personA, personB);
            }}
            className="meta-label text-[10px] px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            title="Manual matchmaker: pick any two people"
          >
            <Sparkles size={11} className="text-amber-300" />
            <span className="hidden sm:inline">PAIR PICKER</span>
          </button>

          <div className="meta-label text-[10px] text-[var(--magenta)] font-bold hidden lg:block">
            ROUND {currentStage?.id || '01'} // {currentStage?.title || 'INTRO'}
          </div>
        </div>
      </header>

      {/* Encounter Switcher Bar (Data-Driven Navigation with Prev/Next Arrows) */}
      <div className="w-full bg-[#14141B] border-b border-[var(--line)] py-2 px-3 sm:px-4 flex items-center justify-between sm:justify-center gap-2 overflow-x-auto scrollbar-thin z-20 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => navigateDate('prev')}
            className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-[#B4B4C0] hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Previous encounter"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-[#B4B4C0] hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Next encounter"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsChooseDateModalOpen(true);
          }}
          className="px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
        >
          <span>✦ ALL 25 PROFILES</span>
        </button>

        <span className="w-px h-4 bg-white/15 mx-1 hidden sm:inline" />

        <span className="meta-label text-[9px] text-[#A0A0AE] font-bold shrink-0 hidden md:inline">
          TOP & RECENT DATES:
        </span>

        {/* Data-driven horizontal chip shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {recentPairs.map(cp => {
            const isActive = (String(personA?.id) === String(cp.id1) && String(personB?.id) === String(cp.id2)) ||
                             (String(personA?.id) === String(cp.id2) && String(personB?.id) === String(cp.id1));
            return (
              <Link
                key={`${cp.id1}-${cp.id2}`}
                href={`/dates/${cp.id1}-${cp.id2}`}
                onClick={() => sounds.playClick()}
                className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/20 !text-white font-bold border border-white/40 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-[#B4B4C0] hover:text-white border border-white/5'
                }`}
              >
                <span>{cp.label}</span>
                {cp.score && (
                  <span className={`text-[10px] ${isActive ? 'text-[var(--magenta)]' : 'text-[#A0A0AE]'}`}>
                    · {cp.score}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Non-blocking Notice when Manual Pair is Outside Default Preferences */}
      {isOutsideDefaultPreference && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-1 px-4 text-center z-20 shrink-0 animate-fade-in">
          <p className="meta-label text-[10px] text-amber-300 font-medium">
            ✦ Outside default preferences, compatibility is scored honestly (Manual Date)
          </p>
        </div>
      )}

      {/* Center Stage: generous padding, no justify-center clipping, fits comfortably on 610px height */}
      <main className="flex-1 flex flex-col items-center justify-start pt-3 sm:pt-5 pb-20 sm:pb-28 px-4 sm:px-6 max-w-5xl mx-auto w-full relative z-20 overflow-y-auto overflow-x-hidden">
        {/* Loading / Simulating State */}
        {isSimulating && (
          <div className="card-panel-elevated p-8 sm:p-12 border border-[var(--violet)]/40 max-w-xl w-full text-center space-y-6 shadow-2xl animate-fade-in my-auto">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--violet)]/20 animate-ping" />
              <div className="w-full h-full rounded-full border-2 border-t-[var(--violet)] border-r-[var(--magenta)] border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
                <Sparkles size={20} className="text-[var(--violet)]" />
              </div>
            </div>

            <div>
              <div className="meta-label text-[10px] text-[var(--violet)] font-bold tracking-widest uppercase mb-1">
                AUTONOMOUS ENCOUNTER INITIALIZING
              </div>
              <h3 className="section-title text-xl text-white">
                SIMULATING 6-STAGE DATE
              </h3>
              <p className="body-text text-xs text-[#B4B4C0] mt-2 max-w-sm mx-auto">
                Agents are exploring shared values, daily rhythms, and authentic chemistry between {personA.name} and {personB.name}...
              </p>
            </div>
          </div>
        )}

        {/* Error State with Retry Button */}
        {!isSimulating && simulationError && (
          <div className="card-panel-elevated p-8 border border-rose-500/40 max-w-xl w-full text-center space-y-4 shadow-2xl animate-fade-in my-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-200">
                DATE SIMULATION ENCOUNTERED AN ISSUE
              </h3>
              <p className="text-xs text-[#B4B4C0] mt-1 font-mono">
                {simulationError}
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                loadOrSimulateDate(personA, personB, null);
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] !text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
            >
              ↻ RETRY DATE ENCOUNTER
            </button>
          </div>
        )}

        {/* Active Conversation Dialogue Stream */}
        {!isSimulating && !simulationError && !finished && (
          <div className="w-full flex flex-col items-center">
            {/* Avatars and Animated Energy Link */}
            <div className="w-full flex items-center justify-between mb-3 sm:mb-6 pt-1">
              {/* Agent A Block */}
              <div className="flex flex-col items-center w-36 sm:w-44 text-center">
                {/* Local photo at 400x400 with object-position: center 20% and brighter ring */}
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 transition-all duration-500 bg-[#14141B] shrink-0 ${
                  activeSpeaker === 'A'
                    ? 'scale-105 ring-2 ring-[var(--violet)] shadow-[0_0_50px_rgba(139,92,246,0.6)]'
                    : 'opacity-50 ring-1 ring-white/20'
                }`}>
                  {!avatarErrorA ? (
                    <img
                      src={`/avatars/${personA.id}.jpg`}
                      alt={personA.name}
                      onError={() => setAvatarErrorA(true)}
                      className="w-full h-full rounded-full object-cover object-[center_20%]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--violet)] to-slate-800 flex items-center justify-center font-bold text-lg text-white font-mono">
                      {personA.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* AGENT A badge placed BELOW avatar, whitespace-nowrap, #D4D4DC on #1C1C24 */}
                <div className="mt-2.5 px-3 py-0.5 rounded-full bg-[#1C1C24] border border-white/15 meta-label text-[9px] text-[#D4D4DC] whitespace-nowrap shadow-sm">
                  AGENT A
                </div>

                <div className="font-semibold text-sm text-[#F4F4F6] mt-1.5 truncate max-w-full">
                  {personA.name}
                </div>

                {/* Headline: line-clamp-2 with title tooltip */}
                <div
                  className="meta-label text-[10px] text-[#A0A0AE] line-clamp-2 max-w-[160px] mt-0.5 cursor-help"
                  title={personA.headline}
                >
                  {personA.headline}
                </div>

                <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-[#F4F4F6] mt-1.5 font-bold inline-block">
                  {personA.gender === 'female' ? 'FEMALE (F)' : 'MALE (M)'}
                </span>

                {/* Verified Social Badges for Agent A */}
                <div className="mt-2" onClick={e => e.stopPropagation()}>
                  <SocialBadges
                    linkedinUrl={personA.linkedin_url}
                    instagramUrl={personA.instagram_url}
                    size="sm"
                    showHandles={false}
                  />
                </div>
              </div>

              {/* Animated Agent Link (Gradient line with moving pulse from speaking to listening agent) */}
              <div className="flex-1 mx-2 sm:mx-6 relative flex items-center justify-center py-6">
                {/* Base connection track */}
                <div className={`w-full h-1 rounded-full transition-opacity duration-300 relative overflow-hidden ${
                  currentTurn ? 'opacity-100' : 'opacity-35'
                }`}
                style={{
                  background: 'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(232,121,249,0.8) 50%, rgba(59,130,246,0.3) 100%)',
                  boxShadow: warmth > 75 ? '0 0 20px rgba(232,121,249,0.5)' : 'none'
                }}
                >
                  {/* Moving pulse bar */}
                  <div
                    className={`absolute top-0 bottom-0 w-1/3 rounded-full bg-gradient-to-r from-[var(--violet)] via-white to-[var(--magenta)] shadow-[0_0_15px_white] ${
                      activeSpeaker === 'A' ? 'animate-pulse-ltr' : 'animate-pulse-rtl'
                    }`}
                  />
                </div>

                {/* Center energy indicator */}
                <div className={`absolute w-3.5 h-3.5 rounded-full border-2 border-[#07070A] transition-all duration-300 ${
                  activeSpeaker === 'A'
                    ? 'bg-[var(--violet)] shadow-[0_0_15px_var(--violet)]'
                    : 'bg-[var(--magenta)] shadow-[0_0_15px_var(--magenta)]'
                }`} />
              </div>

              {/* Agent B Block */}
              <div className="flex flex-col items-center w-36 sm:w-44 text-center">
                {/* Local photo at 400x400 with object-position: center 20% and brighter ring */}
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 transition-all duration-500 bg-[#14141B] shrink-0 ${
                  activeSpeaker === 'B'
                    ? 'scale-105 ring-2 ring-[var(--magenta)] shadow-[0_0_50px_rgba(232,121,249,0.6)]'
                    : 'opacity-50 ring-1 ring-white/20'
                }`}>
                  {!avatarErrorB ? (
                    <img
                      src={`/avatars/${personB.id}.jpg`}
                      alt={personB.name}
                      onError={() => setAvatarErrorB(true)}
                      className="w-full h-full rounded-full object-cover object-[center_20%]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--magenta)] to-slate-800 flex items-center justify-center font-bold text-lg text-white font-mono">
                      {personB.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* AGENT B badge placed BELOW avatar, whitespace-nowrap, #D4D4DC on #1C1C24 */}
                <div className="mt-2.5 px-3 py-0.5 rounded-full bg-[#1C1C24] border border-white/15 meta-label text-[9px] text-[#D4D4DC] whitespace-nowrap shadow-sm">
                  AGENT B
                </div>

                <div className="font-semibold text-sm text-[#F4F4F6] mt-1.5 truncate max-w-full">
                  {personB.name}
                </div>

                {/* Headline: line-clamp-2 with title tooltip */}
                <div
                  className="meta-label text-[10px] text-[#A0A0AE] line-clamp-2 max-w-[160px] mt-0.5 cursor-help"
                  title={personB.headline}
                >
                  {personB.headline}
                </div>

                <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-[#F4F4F6] mt-1.5 font-bold inline-block">
                  {personB.gender === 'female' ? 'FEMALE (F)' : 'MALE (M)'}
                </span>

                {/* Verified Social Badges for Agent B */}
                <div className="mt-2" onClick={e => e.stopPropagation()}>
                  <SocialBadges
                    linkedinUrl={personB.linkedin_url}
                    instagramUrl={personB.instagram_url}
                    size="sm"
                    showHandles={false}
                  />
                </div>
              </div>
            </div>

            {/* Typewriter Message Stream Card (with ref for auto-scrolling) */}
            <div
              ref={messageCardRef}
              className="w-full max-w-2xl text-center space-y-4 p-6 sm:p-8 rounded-2xl bg-[#0E0E13]/90 backdrop-blur-xl border border-[var(--line)] shadow-2xl relative"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-[#B4B4C0] font-semibold flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeSpeaker === 'A' ? 'bg-[var(--violet)]' : 'bg-[var(--magenta)]'}`} />
                <span>{activeSpeaker === 'A' ? personA.name.toUpperCase() : personB.name.toUpperCase()}&apos;S AGENT SPEAKING</span>
              </div>

              {/* Full message render with typewriter completion guarantee */}
              <p className="body-text text-base sm:text-lg text-[#F4F4F6] font-light leading-relaxed min-h-[90px] flex items-center justify-center px-2">
                &ldquo;{displayedText}&rdquo;
                <span className="w-1.5 h-5 bg-[var(--violet)] inline-block ml-1 animate-pulse" />
              </p>

              {/* Thought Annotation */}
              {currentTurn && (
                <div className="inline-block p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#B4B4C0] italic max-w-xl">
                  Agent reasoning: &ldquo;{currentTurn.thought}&rdquo;
                </div>
              )}

              {/* Signals */}
              {currentTurn?.signals && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {currentTurn.signals.map((sig, i) => (
                    <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--magenta)]">
                      ✦ {sig}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Finished Result View */}
        {!isSimulating && !simulationError && finished && (
          <div className="card-panel-elevated p-8 sm:p-10 border border-[var(--violet)]/40 max-w-2xl w-full text-center space-y-6 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-pulse" />
              <div className="font-mono text-xs text-[var(--violet)] font-bold tracking-wider">
                DATE SYNTHESIS COMPLETE // MUTUAL VERDICT
              </div>
            </div>

            {/* Candidate Avatars Shared Ring */}
            <div className="flex items-center justify-center -space-x-4 py-1">
              <img
                src={`/avatars/${personA.id}.jpg`}
                alt={personA.name}
                className="w-16 h-16 rounded-full border-2 border-[var(--violet)] object-cover object-[center_20%] shadow-lg"
              />
              <div className="w-8 h-8 rounded-full bg-[#14141B] border border-[var(--line)] flex items-center justify-center text-xs font-mono font-bold text-[var(--magenta)] z-10">
                ✦
              </div>
              <img
                src={`/avatars/${personB.id}.jpg`}
                alt={personB.name}
                className="w-16 h-16 rounded-full border-2 border-[var(--magenta)] object-cover object-[center_20%] shadow-lg"
              />
            </div>

            <div className="text-6xl sm:text-8xl font-mono font-bold tracking-tighter bg-gradient-to-r from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] bg-clip-text text-transparent">
              {scoreCounter}%
            </div>

            <div>
              <h3 className="section-title text-xl text-white">
                {scoreCounter >= 75 ? 'HIGH ROMANTIC RESONANCE' : 'MODERATE COMPATIBILITY'}
              </h3>
              <p className="body-text text-sm italic mt-2 text-[#B4B4C0]">
                &ldquo;{matchDetails?.matchReason || `${personA.name} and ${personB.name} share clear ambition and authentic curiosity, creating a balanced dynamic.`}&rdquo;
              </p>
            </div>

            {/* 4-Factor Metric Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono text-xs pt-4 border-t border-[var(--line)]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[#A0A0AE]">VALUES</div>
                <div className="text-base font-bold text-[var(--violet)] mt-1">
                  {matchDetails?.breakdown?.values?.score || 82}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--violet)] h-full" style={{ width: `${matchDetails?.breakdown?.values?.score || 82}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[#A0A0AE]">INTERESTS</div>
                <div className="text-base font-bold text-[var(--blue)] mt-1">
                  {matchDetails?.breakdown?.interests?.score || 78}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--blue)] h-full" style={{ width: `${matchDetails?.breakdown?.interests?.score || 78}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[#A0A0AE]">LIFESTYLE</div>
                <div className="text-base font-bold text-[var(--magenta)] mt-1">
                  {matchDetails?.breakdown?.lifestyle?.score || 85}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--magenta)] h-full" style={{ width: `${matchDetails?.breakdown?.lifestyle?.score || 85}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[#A0A0AE]">NEEDS</div>
                <div className="text-base font-bold text-[var(--pink)] mt-1">
                  {matchDetails?.breakdown?.needs?.score || 80}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--pink)] h-full" style={{ width: `${matchDetails?.breakdown?.needs?.score || 80}%` }} />
                </div>
              </div>
            </div>

            {/* Sparks & Tensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="text-[var(--violet)] font-bold flex items-center gap-1.5">
                  <Check size={13} />
                  <span>WHY THEY CONNECTED</span>
                </div>
                <ul className="text-[11px] text-[#B4B4C0] space-y-1">
                  {(matchDetails?.sparks || [
                    `Resonance on ${personA.values?.[0] || 'freedom'} and personal ambition`,
                    'Shared demand for creative agency and autonomy',
                    'Direct honesty over polite silence'
                  ]).map((s: string, idx: number) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="text-[var(--pink)] font-bold flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>POTENTIAL FRICTION</span>
                </div>
                <ul className="text-[11px] text-[#B4B4C0] space-y-1">
                  {(matchDetails?.tensions || [
                    'Demanding schedules require proactive calendar boundaries',
                    'Both operate at intense focus cadences'
                  ]).map((t: string, idx: number) => (
                    <li key={idx}>• {t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/rankings/${personA.id}`}
                onClick={() => sounds.playClick()}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] !text-white font-mono text-xs font-bold shadow-lg hover:brightness-110 transition-all text-center"
              >
                {personA.name.toUpperCase()}&apos;S RANKINGS →
              </Link>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsChooseDateModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/10 hover:bg-[var(--violet)]/20 !text-white font-mono text-xs font-bold transition-all text-center cursor-pointer"
              >
                ✦ CHOOSE ANOTHER DATE
              </button>

              <Link
                href={`/rankings/${personB.id}`}
                onClick={() => sounds.playClick()}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/30 !text-white font-mono text-xs font-bold hover:bg-white/10 transition-colors text-center"
              >
                {personB.name.toUpperCase()}&apos;S RANKINGS →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Controls Bar (Fixed height shrink-0 with generous top padding from main) */}
      <footer className="p-4 sm:p-5 border-t border-[var(--line)] flex items-center justify-between shrink-0 relative z-20 bg-[#0E0E13]/95 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {!finished && !isSimulating && !simulationError && (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="glass-pill px-4 py-2 rounded-full font-mono text-xs flex items-center gap-1.5 text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setSpeed(s => (s === 1 ? 2 : s === 2 ? 4 : 1));
                }}
                className="glass-pill px-3 py-2 rounded-full font-mono text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                SPEED {speed}X
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!finished && !isSimulating && !simulationError && (
            <button
              onClick={() => {
                sounds.playMatch();
                setFinished(true);
              }}
              className="font-mono text-xs text-[#B4B4C0] hover:text-white transition-colors cursor-pointer"
            >
              SKIP TO RESULT →
            </button>
          )}

          {finished && (
            <button
              onClick={() => {
                sounds.playClick();
                setFinished(false);
                setCurrentTurnIdx(0);
              }}
              className="glass-pill px-4 py-2 rounded-full font-mono text-xs flex items-center gap-1.5 !text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>REPLAY DATE</span>
            </button>
          )}
        </div>
      </footer>

      {/* Choose Date Modal (Searchable panel of all 25 people with their complete dates) */}
      <ChooseDateModal
        isOpen={isChooseDateModalOpen}
        onClose={() => setIsChooseDateModalOpen(false)}
        allPeople={allPeople}
        matchesData={matchesData}
        onOpenPairPicker={(cand) => {
          setIsChooseDateModalOpen(false);
          openPairPicker(cand || personA, personB);
        }}
      />

      {/* Embedded CSS Keyframes for Agent Link Traveling Pulse & Reduced Motion */}
      <style jsx>{`
        @keyframes pulse-ltr {
          0% {
            transform: translateX(-100%);
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%);
            opacity: 0.2;
          }
        }
        @keyframes pulse-rtl {
          0% {
            transform: translateX(200%);
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0.2;
          }
        }
        .animate-pulse-ltr {
          animation: pulse-ltr 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-pulse-rtl {
          animation: pulse-rtl 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-ltr,
          .animate-pulse-rtl {
            animation: none;
            transform: none;
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
