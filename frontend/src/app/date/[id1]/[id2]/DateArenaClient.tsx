'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, Check, AlertTriangle, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { sounds } from '../../../../utils/sound';
import { getDataUrl } from '../../../../utils/paths';
import { isPairEligible } from '../../../../utils/matching';
import SocialBadges from '../../../../components/SocialBadges';
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

const CURATED_PAIRS = [
  { id1: '1', id2: '14', label: 'Pieter (M) × Sara (F)' },
  { id1: '2', id2: '15', label: 'Huberman (M) × Melanie (F)' },
  { id1: '3', id2: '16', label: 'Lex (M) × Whitney (F)' },
  { id1: '8', id2: '21', label: 'Alexis (M) × Priyanka (F)' },
  { id1: '9', id2: '18', label: 'Naval (M) × Mira (F)' },
];

export default function DateArenaClient({ id1, id2 }: { id1: string; id2: string }) {
  const { openPairPicker } = usePairPicker();
  const [personA, setPersonA] = useState<any>(null);
  const [personB, setPersonB] = useState<any>(null);
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
  const [recentPairs, setRecentPairs] = useState<{ id1: string; id2: string; label: string }[]>(CURATED_PAIRS);

  const buildTurnsFromMatch = (match: any, pA: any, pB: any): Turn[] => {
    if (match?.conversation && match.conversation.length >= 6) {
      return match.conversation.map((c: any, idx: number) => ({
        speaker: c.agent === 'A' ? 'A' : 'B',
        message: c.message,
        thought: c.thought || (idx % 2 === 0
          ? `Evaluating ${pB.name}'s craft and sovereign boundaries.`
          : `Probing ${pA.name}'s daily cadence and emotional honesty.`),
        signals: idx === 0 ? ['Craft Devotion', 'Initial Chemistry']
               : idx === 1 ? ['Creative Drive', 'Boundary Protection']
               : idx === 2 ? ['Sovereign Autonomy', 'Zero Co-dependency']
               : idx === 3 ? ['Authenticity', 'High Agency']
               : idx === 4 ? ['Radical Candor', 'Zero Status Games']
               : ['Mutual Synthesis', 'Positive Verdict']
      }));
    }

    return [
      {
        speaker: 'A',
        thought: `Evaluating ${pB.name}'s craft and creative pacing.`,
        message: `Hello. I represent ${pA.name}. I noticed your dedication to ${pB.interests?.[0] || 'your craft'} and your regular time around ${pB.hobbies?.[0] || 'exploring'}. How does that shape your day-to-day rhythm?`,
        signals: ['Craft Devotion', 'Daily Cadence']
      },
      {
        speaker: 'B',
        thought: `Responding with boundary honesty and probing work-life priorities.`,
        message: `Thank you. For ${pB.name}, those rituals protect clarity. Looking at ${pA.name}'s trajectory in ${pA.interests?.[0] || 'innovation'}, there is intense creative momentum. How do you protect space for a partner amidst that?`,
        signals: ['Creative Drive', 'Boundary Protection']
      },
      {
        speaker: 'A',
        thought: `Addressing sovereignty and independence in long-term relationships.`,
        message: `Our core rule is sovereign autonomy. A relationship should never demand either person shrink their ambition. We thrive with someone self-directed, so when we are together, it is completely intentional.`,
        signals: ['Sovereign Autonomy', 'Zero Co-dependency']
      },
      {
        speaker: 'B',
        thought: `Affirming alignment on values and testing tolerance for intense schedules.`,
        message: `That aligns with ${pB.name}'s explicit requirement. We value ${pB.values?.[0] || 'authenticity'} over performative expectations. Being with someone who understands high-agency living eliminates resentment.`,
        signals: ['Authenticity', 'High Agency']
      },
      {
        speaker: 'A',
        thought: `Testing non-negotiable dealbreakers: zero tolerance for superficial status games.`,
        message: `A non-negotiable for my person: zero tolerance for passive-aggressive games or status pretense. When disagreements arise, we require radical candor over polite silence. How does your person handle conflict?`,
        signals: ['Radical Candor', 'Zero Pretense']
      },
      {
        speaker: 'B',
        thought: `Confirming mutual resonance and delivering positive subjective verdict.`,
        message: `Directly, face-to-face, with calm empathy. Life is too short for unaddressed tension. Our internal metrics confirm compatibility between ${pA.name} and ${pB.name}.`,
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

      const resJson = await response.json();
      if (!response.ok || !resJson.success || !resJson.data) {
        throw new Error(resJson.error || 'Failed to simulate agent conversation.');
      }

      const simMatch = resJson.data;

      // Save to unordered pair cache in localStorage
      customMatches[pairKey] = simMatch;
      localStorage.setItem('custom_matches', JSON.stringify(customMatches));

      setMatchDetails(simMatch);
      const score = simMatch.compatibilityScore || 84;
      setTargetScore(score);
      const generated = buildTurnsFromMatch(simMatch, pA, pB);
      setTurns(generated);
      setCurrentTurnIdx(0);
      setIsSimulating(false);
      sounds.playMatch();
    } catch (err: any) {
      console.error('Simulation error:', err);
      setSimulationError(err?.message || 'Date simulation encountered an error. Please retry.');
      setIsSimulating(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(getDataUrl('data/profiles_analyzed.json')).then(r => r.json()),
      fetch(getDataUrl('data/matches.json')).then(r => r.json()).catch(() => null)
    ])
      .then(([data, matchData]) => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]');
        const all = [...added, ...data];
        const pA = all.find((p: any) => String(p.id) === String(id1)) || all[0];

        let pB = all.find((p: any) => String(p.id) === String(id2));
        // Only fall back if pB does not exist or user picked the exact same person
        if (!pB || String(pB.id) === String(pA.id)) {
          pB = all.find((p: any) => String(p.id) !== String(pA.id)) || all[1];
        }

        setPersonA(pA);
        setPersonB(pB);

        // Update recent switcher pairs dynamically with custom matches
        if (typeof window !== 'undefined') {
          const customMatches = JSON.parse(localStorage.getItem('custom_matches') || '{}');
          const customList: { id1: string; id2: string; label: string }[] = [];
          Object.keys(customMatches).forEach(key => {
            const [cand1, cand2] = key.split('_');
            const found1 = all.find((p: any) => String(p.id) === cand1);
            const found2 = all.find((p: any) => String(p.id) === cand2);
            if (found1 && found2) {
              customList.push({
                id1: String(found1.id),
                id2: String(found2.id),
                label: `${found1.name.split(' ')[0]} × ${found2.name.split(' ')[0]}`
              });
            }
          });
          // Merge unique pairs
          const combined = [...customList, ...CURATED_PAIRS];
          const seen = new Set();
          const unique = combined.filter(p => {
            const k = [p.id1, p.id2].sort().join('_');
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          setRecentPairs(unique.slice(0, 8));
        }

        loadOrSimulateDate(pA, pB, matchData);
      })
      .catch(console.error);
  }, [id1, id2, loadOrSimulateDate]);

  // Typewriter effect
  useEffect(() => {
    if (!isPlaying || finished || turns.length === 0 || currentTurnIdx < 0) return;

    const current = turns[currentTurnIdx];
    if (!current) return;
    const fullText = current.message;
    let charIdx = 0;
    setDisplayedText('');

    const baseDelay = 18 / speed;
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx % 4 === 0) sounds.playClick();

      if (charIdx >= fullText.length) {
        clearInterval(interval);
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
  const isOutsideDefaultPreference = !isPairEligible(personA, personB);

  return (
    <div className="fixed inset-0 z-30 bg-[var(--bg)] flex flex-col justify-between overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--violet)]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 border-b border-[var(--line)] flex items-center justify-between shrink-0 relative z-20">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="meta-label flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>EXIT CHAMBER</span>
        </Link>

        {/* 6-Step Progress Track */}
        <div className="hidden sm:flex items-center gap-2">
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
                  isCurrent ? 'text-[var(--violet)] font-bold' : isCompleted ? 'text-white font-bold' : 'text-[var(--text-disabled)]'
                }`}>
                  {s.id}
                </span>
                {idx < STAGES.length - 1 && <span className="w-3 h-px bg-white/15" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              openPairPicker(personA, personB);
            }}
            className="meta-label text-[10px] px-3 py-1 rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/15 text-white hover:bg-[var(--violet)]/25 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={11} className="text-[var(--magenta)]" />
            <span>PICK NEW PAIR</span>
          </button>

          <div className="meta-label text-[10px] text-[var(--magenta)] font-bold hidden sm:block">
            ROUND {currentStage?.id || '01'} // {currentStage?.title || 'INTRO'}
          </div>
        </div>
      </header>

      {/* Encounter Switcher Bar */}
      <div className="w-full bg-[var(--surface-2)]/90 border-b border-[var(--line)] py-2.5 px-4 flex items-center justify-center gap-2 overflow-x-auto scrollbar-thin z-20 shrink-0">
        <button
          onClick={() => {
            sounds.playClick();
            openPairPicker(personA, personB);
          }}
          className="px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
        >
          <span>✦ DATE ANY TWO PEOPLE</span>
        </button>

        <span className="w-px h-4 bg-white/15 mx-1 hidden sm:inline" />

        <span className="meta-label text-[9px] text-[var(--text-secondary)] font-bold shrink-0 hidden sm:inline">
          RECENT ENCOUNTERS:
        </span>
        {recentPairs.map(cp => {
          const isActive = (String(personA?.id) === String(cp.id1) && String(personB?.id) === String(cp.id2)) ||
                           (String(personA?.id) === String(cp.id2) && String(personB?.id) === String(cp.id1));
          return (
            <Link
              key={`${cp.id1}-${cp.id2}`}
              href={`/date/${cp.id1}/${cp.id2}`}
              onClick={() => sounds.playClick()}
              className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all ${
                isActive
                  ? 'bg-white/20 !text-white font-bold border border-white/30'
                  : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white border border-white/5'
              }`}
            >
              {cp.label}
            </Link>
          );
        })}
      </div>

      {/* Non-blocking Notice when Manual Pair is Outside Default Preferences */}
      {isOutsideDefaultPreference && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center z-20 shrink-0 animate-fade-in">
          <p className="meta-label text-[10px] text-amber-300 font-medium">
            ✦ Outside default preferences, compatibility is scored honestly
          </p>
        </div>
      )}

      {/* Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full relative z-20 overflow-y-auto">
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
              <p className="body-text text-xs text-[var(--text-secondary)] mt-2 max-w-sm mx-auto">
                Agents are evaluating craft devotion, sovereign lifestyle rhythms, and conflict resolution axioms between {personA.name} and {personB.name}...
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
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
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
            <div className="w-full flex items-center justify-between mb-8 sm:mb-10">
              {/* Agent A Orb */}
              <div className="flex flex-col items-center">
                <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 transition-all duration-500 ${
                  activeSpeaker === 'A'
                    ? 'scale-105 ring-2 ring-[var(--violet)] shadow-[0_0_50px_rgba(139,92,246,0.6)]'
                    : 'opacity-40 ring-1 ring-white/10'
                }`}>
                  <img src={personA.photo} alt={personA.name} className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] meta-label text-[8px] text-[var(--violet)]">
                    AGENT A
                  </div>
                </div>
                <div className="font-semibold text-sm text-[var(--text)] mt-4">{personA.name}</div>
                <div className="meta-label text-[9px] text-[var(--text-secondary)] truncate max-w-[140px]">{personA.headline}</div>
                <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-white mt-1.5 font-bold inline-block">
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

              {/* Energy Line */}
              <div className="flex-1 mx-4 sm:mx-8 relative flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] shadow-[0_0_15px_rgba(232,121,249,0.5)]" />
                <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_20px_white] animate-ping" />
              </div>

              {/* Agent B Orb */}
              <div className="flex flex-col items-center">
                <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 transition-all duration-500 ${
                  activeSpeaker === 'B'
                    ? 'scale-105 ring-2 ring-[var(--magenta)] shadow-[0_0_50px_rgba(232,121,249,0.6)]'
                    : 'opacity-40 ring-1 ring-white/10'
                }`}>
                  <img src={personB.photo} alt={personB.name} className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] meta-label text-[8px] text-[var(--magenta)]">
                    AGENT B
                  </div>
                </div>
                <div className="font-semibold text-sm text-[var(--text)] mt-4">{personB.name}</div>
                <div className="meta-label text-[9px] text-[var(--text-secondary)] truncate max-w-[140px]">{personB.headline}</div>
                <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-white mt-1.5 font-bold inline-block">
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

            {/* Typewriter Message Stream */}
            <div className="w-full max-w-2xl text-center space-y-4 p-6 sm:p-8 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--line)] shadow-2xl">
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                {activeSpeaker === 'A' ? personA.name.toUpperCase() : personB.name.toUpperCase()}&apos;S AGENT SPEAKING
              </div>

              <p className="body-text text-lg sm:text-xl text-[var(--text)] font-light leading-relaxed min-h-[90px] flex items-center justify-center">
                &ldquo;{displayedText}&rdquo;
                <span className="w-1.5 h-5 bg-[var(--violet)] inline-block ml-1 animate-pulse" />
              </p>

              {/* Thought Annotation */}
              {currentTurn && (
                <div className="inline-block p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary)] italic">
                  Agent reasoning: &ldquo;{currentTurn.thought}&rdquo;
                </div>
              )}

              {/* Signals */}
              {currentTurn?.signals && (
                <div className="flex items-center justify-center gap-2 pt-2">
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
              <div className="font-mono text-xs text-[var(--violet)] font-bold tracking-wider">DATE SYNTHESIS COMPLETE // MUTUAL VERDICT</div>
            </div>

            {/* Candidate Avatars Shared Ring */}
            <div className="flex items-center justify-center -space-x-4 py-1">
              <img src={personA.photo} alt={personA.name} className="w-16 h-16 rounded-full border-2 border-[var(--violet)] object-cover shadow-lg" />
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-xs font-mono font-bold text-[var(--magenta)] z-10">
                ✦
              </div>
              <img src={personB.photo} alt={personB.name} className="w-16 h-16 rounded-full border-2 border-[var(--magenta)] object-cover shadow-lg" />
            </div>

            <div className="text-6xl sm:text-8xl font-mono font-bold tracking-tighter bg-gradient-to-r from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] bg-clip-text text-transparent">
              {scoreCounter}%
            </div>

            <div>
              <h3 className="section-title text-xl text-white">
                {scoreCounter >= 75 ? 'HIGH ROMANTIC RESONANCE' : 'MODERATE COMPATIBILITY'}
              </h3>
              <p className="body-text text-sm italic mt-2 text-[var(--text-secondary)]">
                &ldquo;{matchDetails?.matchReason || `${personA.name} and ${personB.name} share sovereign ambition and direct communication, creating a balanced dynamic.`}&rdquo;
              </p>
            </div>

            {/* 4-Factor Metric Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono text-xs pt-4 border-t border-[var(--line)]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[var(--text-secondary)]">VALUES</div>
                <div className="text-base font-bold text-[var(--violet)] mt-1">
                  {matchDetails?.breakdown?.values?.score || 82}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--violet)] h-full" style={{ width: `${matchDetails?.breakdown?.values?.score || 82}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[var(--text-secondary)]">INTERESTS</div>
                <div className="text-base font-bold text-[var(--blue)] mt-1">
                  {matchDetails?.breakdown?.interests?.score || 78}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--blue)] h-full" style={{ width: `${matchDetails?.breakdown?.interests?.score || 78}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[var(--text-secondary)]">LIFESTYLE</div>
                <div className="text-base font-bold text-[var(--magenta)] mt-1">
                  {matchDetails?.breakdown?.lifestyle?.score || 85}%
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--magenta)] h-full" style={{ width: `${matchDetails?.breakdown?.lifestyle?.score || 85}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="meta-label text-[9px] text-[var(--text-secondary)]">NEEDS</div>
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
                <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
                  {(matchDetails?.sparks || [
                    `Resonance on ${personA.values?.[0] || 'freedom'} and ${personB.values?.[0] || 'growth'}`,
                    'Shared demand for creative agency and autonomy',
                    'Radical honesty over polite passive aggression'
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
                <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
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
                  openPairPicker(personA, personB);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--violet)]/50 bg-[var(--violet)]/10 hover:bg-[var(--violet)]/20 !text-white font-mono text-xs font-bold transition-all text-center cursor-pointer"
              >
                ✦ DATE DIFFERENT PAIR
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

      {/* Bottom Controls Bar */}
      <footer className="p-6 border-t border-[var(--line)] flex items-center justify-between shrink-0 relative z-20 bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {!finished && !isSimulating && !simulationError && (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="glass-pill px-4 py-2 rounded-full font-mono text-xs flex items-center gap-1.5 text-[var(--text)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setSpeed(s => (s === 1 ? 2 : s === 2 ? 4 : 1));
                }}
                className="glass-pill px-3 py-2 rounded-full font-mono text-xs text-[var(--text)] hover:bg-white/10 transition-colors cursor-pointer"
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
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
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
    </div>
  );
}
