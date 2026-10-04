'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../utils/sound';
import { getDataUrl } from '../../../utils/paths';

export default function RankingsClient({ id }: { id: string }) {
  const [person, setPerson] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(getDataUrl('data/profiles_analyzed.json')).then(r => r.json()),
      fetch(getDataUrl('data/rankings.json')).then(r => r.json()).catch(() => null),
      fetch(getDataUrl('data/matches.json')).then(r => r.json()).catch(() => null)
    ]).then(([analyzed, rankData, matchData]) => {
      const added = JSON.parse(localStorage.getItem('added_people') || '[]');
      const all = [...added, ...analyzed];
      const p = all.find((x: any) => String(x.id) === String(id)) || all[0];
      setPerson(p);

      if (rankData && rankData[id]) {
        const enriched = (rankData[id].ranked || []).map((r: any) => {
          const profile = all.find((a: any) => String(a.id) === String(r.id));
          const match = matchData?.[id]?.[r.id];
          return {
            ...r,
            profile,
            match
          };
        });
        setRankings(enriched);
      }
    }).catch(console.error);
  }, [id]);

  if (!person) return null;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-5xl mx-auto relative z-20">
      {/* Return */}
      <Link
        href="/"
        onClick={() => sounds.playClick()}
        className="meta-label inline-flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors mb-12"
      >
        <ArrowLeft size={14} />
        <span>RETURN TO THE FIELD</span>
      </Link>

      {/* Title */}
      <div className="mb-16 border-b border-[var(--line)] pb-8">
        <div className="meta-label text-[var(--violet)] mb-2">TARGET PERSON // {person.name.toUpperCase()}</div>
        <h1 className="hero-headline text-white mb-4">
          WHO DID YOUR<br />
          <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] bg-clip-text text-transparent">
            AGENT CHOOSE?
          </span>
        </h1>
        <p className="body-text text-sm max-w-lg">
          Ranked from #01 to #{rankings.length} based on autonomous 3-round date simulations and explicit 7-factor weighted alignment.
        </p>
      </div>

      {/* Leaderboard rows with giant numerals 01 02 03 */}
      <div className="space-y-6">
        {rankings.map((match, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const isTop = idx === 0;

          return (
            <div
              key={match.id}
              className={`card-panel p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 ${
                isTop ? 'border-[var(--violet)]/50 shadow-2xl glow-violet' : 'hover:border-white/20'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Numeral + Info */}
                <div className="flex items-start sm:items-center gap-8">
                  {/* Giant Numeral (120px outlined text) */}
                  <div
                    className="font-mono text-7xl sm:text-9xl font-black select-none tracking-tighter shrink-0 leading-none"
                    style={{
                      WebkitTextStroke: '1px rgba(255, 255, 255, 0.15)',
                      color: 'transparent'
                    }}
                  >
                    {num}
                  </div>

                  {/* Candidate Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] truncate">
                        {match.name}
                      </h3>
                      {isTop && (
                        <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-[var(--violet)]/20 text-[var(--violet)] border border-[var(--violet)]/40 font-bold">
                          OPTIMAL FIT
                        </span>
                      )}
                    </div>

                    <div className="meta-label text-xs text-[var(--muted)] truncate mb-3">
                      {match.profile?.headline}
                    </div>

                    {/* One-line Why */}
                    <p className="body-text text-sm italic text-[var(--text)] max-w-xl mb-4 font-light">
                      "{match.reason || 'High compatibility quotient powered by complementary ambition and sovereign lifestyle autonomy.'}"
                    </p>

                    {/* Shared Traits Chips + Friction Note */}
                    <div className="flex flex-wrap items-center gap-2">
                      {(match.profile?.interests || ['AI', 'Product', 'Craft']).slice(0, 3).map((item: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--text)]">
                          ✦ {item}
                        </span>
                      ))}

                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        <span>Demanding schedules</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Replay CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-8 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--line)]">
                  <div className="text-right">
                    <div className="font-mono text-4xl sm:text-5xl font-bold text-[var(--magenta)]">
                      {match.score}%
                    </div>
                    <div className="meta-label text-[9px]">MUTUAL QUOTIENT</div>
                  </div>

                  <Link
                    href={`/date/${id}/${match.id}`}
                    onClick={() => sounds.playClick()}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white meta-label text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
                  >
                    <span>REPLAY DATE</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
