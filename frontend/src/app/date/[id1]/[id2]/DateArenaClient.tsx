'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../../utils/sound';
import { getDataUrl } from '../../../../utils/paths';

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
  const [personA, setPersonA] = useState<any>(null);
  const [personB, setPersonB] = useState<any>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [scoreCounter, setScoreCounter] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(93);

  useEffect(() => {
    fetch(getDataUrl('data/profiles_analyzed.json'))
      .then(r => r.json())
      .then(data => {
        const added = JSON.parse(localStorage.getItem('added_people') || '[]');
        const all = [...added, ...data];
        const pA = all.find((p: any) => String(p.id) === String(id1)) || all[0];
        const pB = all.find((p: any) => String(p.id) === String(id2)) || all[1];
        setPersonA(pA);
        setPersonB(pB);

        const generatedTurns: Turn[] = [
          {
            speaker: 'A',
            thought: `Evaluating ${pB.name}'s craft and creative pacing.`,
            message: `Hello. I represent ${pA.name}. I noticed your dedication to ${pB.interests?.[0] || 'your craft'} and your regular time around ${pB.hobbies?.[0] || 'exploring'}. How does that shape your day-to-day rhythm?`,
            signals: ['Craft Devotion', 'Daily Cadence']
          },
          {
            speaker: 'B',
            thought: `Responding with boundary honesty and probing work-life priorities.`,
            message: `Thank you. For ${pB.name}, those rituals are how we protect clarity. Looking at ${pA.name}'s trajectory in ${pA.interests?.[0] || 'innovation'}, there is an intense creative momentum. How do you protect space for a partner amidst that?`,
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
            message: `Directly, face-to-face, with calm empathy. Life is too short for unaddressed tension. Our internal metrics confirm extraordinary compatibility between ${pA.name} and ${pB.name}.`,
            signals: ['Calm Empathy', 'Mutual Synthesis']
          }
        ];

        setTurns(generatedTurns);
        setCurrentTurnIdx(0);
        setTargetScore(Math.floor(88 + ((pA.id * 7 + pB.id * 11) % 9)));
      })
      .catch(console.error);
  }, [id1, id2]);

  useEffect(() => {
    if (!isPlaying || finished || turns.length === 0 || currentTurnIdx < 0) return;

    const current = turns[currentTurnIdx];
    const fullText = current.message;
    let charIdx = 0;
    setDisplayedText('');

    const baseDelay = 22 / speed;
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx % 3 === 0) sounds.playClick();

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
    }, 18);
    return () => clearInterval(interval);
  }, [finished, targetScore]);

  if (!personA || !personB) return null;

  const currentTurn = turns[currentTurnIdx];
  const activeSpeaker = currentTurn?.speaker || 'A';
  const currentStage = STAGES[Math.min(5, currentTurnIdx)];

  return (
    <div className="fixed inset-0 z-30 bg-[var(--bg)] flex flex-col justify-between overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--violet)]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 border-b border-[var(--line)] flex items-center justify-between shrink-0 relative z-20">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="meta-label flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors"
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
                    : 'bg-white/10'
                }`} />
                <span className={`meta-label text-[9px] ${
                  isCurrent ? 'text-[var(--violet)] font-bold' : isCompleted ? 'text-white' : 'text-white/20'
                }`}>
                  {s.id}
                </span>
                {idx < STAGES.length - 1 && <span className="w-3 h-px bg-white/10" />}
              </div>
            );
          })}
        </div>

        <div className="meta-label text-[10px] text-[var(--magenta)]">
          ROUND {currentStage?.id} // {currentStage?.title}
        </div>
      </header>

      {/* Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full relative z-20">
        {!finished ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-12">
              {/* Agent A Orb */}
              <div className="flex flex-col items-center">
                <div className={`relative w-28 h-28 rounded-full p-1 transition-all duration-500 ${
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
                <div className="meta-label text-[9px] text-[var(--muted)] truncate max-w-[140px]">{personA.headline}</div>
              </div>

              {/* Energy Line */}
              <div className="flex-1 mx-8 relative flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] shadow-[0_0_15px_rgba(232,121,249,0.5)]" />
                <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_20px_white] animate-ping" />
              </div>

              {/* Agent B Orb */}
              <div className="flex flex-col items-center">
                <div className={`relative w-28 h-28 rounded-full p-1 transition-all duration-500 ${
                  activeSpeaker === 'B'
                    ? 'scale-105 ring-2 ring-[var(--blue)] shadow-[0_0_50px_rgba(59,130,246,0.6)]'
                    : 'opacity-40 ring-1 ring-white/10'
                }`}>
                  <img src={personB.photo} alt={personB.name} className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] meta-label text-[8px] text-[var(--blue)]">
                    AGENT B
                  </div>
                </div>
                <div className="font-semibold text-sm text-[var(--text)] mt-4">{personB.name}</div>
                <div className="meta-label text-[9px] text-[var(--muted)] truncate max-w-[140px]">{personB.headline}</div>
              </div>
            </div>

            {/* Conversation Typewriter Output */}
            <div className="w-full max-w-2xl min-h-[160px] text-center space-y-4">
              {currentTurn?.thought && (
                <div className="text-xs font-mono text-[var(--muted)] italic">
                  Agent reasoning: "{currentTurn.thought}"
                </div>
              )}

              <blockquote className="text-xl sm:text-2xl text-[var(--text)] font-light leading-relaxed">
                "{displayedText}"
                <span className="inline-block w-1.5 h-5 bg-[var(--violet)] ml-1 animate-pulse" />
              </blockquote>

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
        ) : (
          /* Finished Result View */
          <div className="card-panel-elevated p-8 sm:p-12 border border-[var(--violet)]/40 max-w-xl w-full text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="meta-label text-[var(--violet)]">DATE FINISHED // SYNTHESIS COMPLETE</div>

            <div className="text-7xl sm:text-9xl font-mono font-bold tracking-tighter bg-gradient-to-r from-[var(--violet)] via-[var(--magenta)] to-[var(--blue)] bg-clip-text text-transparent">
              {scoreCounter}%
            </div>

            <h3 className="section-title text-xl text-white">
              MUTUAL CONNECTION CONFIRMED
            </h3>

            <p className="body-text text-sm italic">
              "Both agents verified compatible boundaries around personal autonomy, high creative drive, and direct communication."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs pt-4 border-t border-[var(--line)]">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="text-[var(--violet)] font-bold flex items-center gap-1.5">
                  <Check size={13} />
                  <span>WHY THEY CONNECTED</span>
                </div>
                <ul className="text-[11px] text-[var(--muted)] space-y-1">
                  <li>• Shared devotion to craft</li>
                  <li>• Aligned independence needs</li>
                  <li>• Radical candor over games</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="text-[var(--pink)] font-bold flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>POTENTIAL FRICTION</span>
                </div>
                <ul className="text-[11px] text-[var(--muted)] space-y-1">
                  <li>• High travel frequencies</li>
                  <li>• Needs advance calendar time</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                href={`/rankings/${personA.id}`}
                onClick={() => sounds.playClick()}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white meta-label text-[10px] font-bold shadow-lg"
              >
                SEE RANKING LEADERBOARD →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Controls Bar */}
      <footer className="p-6 border-t border-[var(--line)] flex items-center justify-between shrink-0 relative z-20 bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {!finished && (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="glass-pill px-4 py-2 rounded-full meta-label text-[10px] flex items-center gap-1.5 text-[var(--text)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setSpeed(s => (s === 1 ? 2 : s === 2 ? 4 : 1));
                }}
                className="glass-pill px-3 py-2 rounded-full meta-label text-[10px] text-[var(--text)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                SPEED {speed}X
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!finished ? (
            <button
              onClick={() => {
                sounds.playMatch();
                setFinished(true);
              }}
              className="meta-label text-[10px] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
            >
              SKIP TO RESULT →
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                setFinished(false);
                setCurrentTurnIdx(0);
              }}
              className="glass-pill px-4 py-2 rounded-full meta-label text-[10px] flex items-center gap-1.5 text-white hover:bg-white/10 transition-colors cursor-pointer"
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
