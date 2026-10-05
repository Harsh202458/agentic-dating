'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, AlertTriangle, UserCheck } from 'lucide-react';
import { sounds } from '../../../utils/sound';
import { getDataUrl } from '../../../utils/paths';
import { isPairEligible } from '../../../utils/matching';

export default function RankingsClient({ id }: { id: string }) {
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(getDataUrl('data/profiles_analyzed.json')).then(r => r.json()),
      fetch(getDataUrl('data/rankings.json')).then(r => r.json()).catch(() => null),
      fetch(getDataUrl('data/matches.json')).then(r => r.json()).catch(() => null)
    ]).then(([analyzed, rankData, matchData]) => {
      const added = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('added_people') || '[]') : [];
      const all = [...added, ...analyzed];
      setAllCandidates(all);

      const p = all.find((x: any) => String(x.id) === String(id)) || all[0];
      setPerson(p);

      let rawRanked = rankData?.[id]?.ranked || [];

      // Filter strictly for mutually eligible matches
      rawRanked = rawRanked.filter((r: any) => {
        const candidateProfile = all.find((a: any) => String(a.id) === String(r.id));
        return isPairEligible(p, candidateProfile);
      });

      // If empty or missing, dynamically compute strictly eligible rankings
      if (rawRanked.length === 0) {
        const eligibleCandidates = all.filter((a: any) => isPairEligible(p, a));
        rawRanked = eligibleCandidates.map((c: any) => ({
          id: c.id,
          name: c.name,
          gender: c.gender,
          score: Math.floor(75 + ((Number(p.id) * 7 + Number(c.id) * 11) % 18)),
          reason: `${p.name} and ${c.name} share sovereign ambition and direct communication, creating a balanced, high-trust dynamic.`
        })).sort((a: any, b: any) => b.score - a.score);
      }

      const enriched = rawRanked.map((r: any) => {
        const profile = all.find((a: any) => String(a.id) === String(r.id));
        const match = matchData?.[id]?.[r.id] || matchData?.[r.id]?.[id];
        return {
          ...r,
          profile,
          match
        };
      });
      setRankings(enriched);
    }).catch(console.error);
  }, [id]);

  if (!person) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
          <span>CALCULATING RANKINGS MATRIX...</span>
        </div>
      </div>
    );
  }

  const seekingLabel = person.gender === 'male' ? 'WOMEN' : 'MEN';

  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-24 px-6 max-w-5xl mx-auto relative z-20">
      {/* Return & Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="meta-label inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO THE FIELD</span>
        </Link>

        {/* Target Profile Link */}
        <Link
          href={`/profile/${person.id}`}
          onClick={() => sounds.playClick()}
          className="meta-label text-[10px] text-[var(--violet)] font-bold hover:underline flex items-center gap-1.5"
        >
          <UserCheck size={13} />
          <span>VIEW {person.name.toUpperCase()}&apos;S DOSSIER</span>
        </Link>
      </div>

      {/* Candidate Selector Switcher */}
      <div className="mb-10 p-4 rounded-2xl bg-white/[0.03] border border-[var(--line)]">
        <div className="meta-label text-[9px] text-[var(--text-secondary)] font-bold mb-3">
          SWITCH CANDIDATE TO VIEW WHO THEIR AGENT CHOSE:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allCandidates.map(c => {
            const isSelected = String(c.id) === String(person.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  sounds.playClick();
                  router.push(`/rankings/${c.id}`);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] !text-white font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white border border-white/5'
                }`}
              >
                <img src={c.photo} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{c.name}</span>
                <span className="text-[9px] opacity-80">({c.gender === 'male' ? 'M' : 'F'})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mb-10 border-b border-[var(--line)] pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="meta-label text-[var(--violet)] font-bold">
            SUBJECT: {person.name.toUpperCase()} ({person.gender?.toUpperCase() || 'MALE'})
          </div>
          <span className="text-white/30">•</span>
          <div className="meta-label text-[var(--magenta)] font-bold">
            SEEKING: {seekingLabel} ONLY (HETEROSEXUAL ALIGNMENT)
          </div>
        </div>

        <h1 className="hero-headline text-white mb-4">
          WHO DID YOUR<br />
          <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] bg-clip-text text-transparent">
            AGENT CHOOSE?
          </span>
        </h1>
        <p className="body-text text-sm sm:text-base max-w-xl text-[var(--text-secondary)]">
          Ranked from #01 to #{rankings.length} based on autonomous 6-stage date simulations across Values, Interests, Lifestyle Rhythm, and Emotional Needs. Showing all verified {seekingLabel.toLowerCase()} in the network.
        </p>
      </div>

      {/* Leaderboard rows with giant numerals */}
      <div className="space-y-6">
        {rankings.map((match, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const isTop = idx === 0;

          return (
            <div
              key={match.id}
              className={`card-panel p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
                isTop ? 'border-[var(--violet)]/50 shadow-2xl glow-violet bg-[var(--surface-2)]' : 'hover:border-white/20'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                {/* Numeral + Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                  {/* Giant Numeral */}
                  <div
                    className="font-mono text-5xl sm:text-7xl lg:text-8xl font-black select-none tracking-tighter shrink-0 leading-none"
                    style={{
                      WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.45)',
                      color: 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {num}
                  </div>

                  {/* Candidate Photo */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0 p-0.5 bg-gradient-to-tr from-[var(--violet)] to-[var(--magenta)]">
                    <img
                      src={match.profile?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={match.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Candidate Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text)] truncate">
                        {match.name}
                      </h3>
                      {isTop && (
                        <span className="meta-label text-[9px] px-2.5 py-0.5 rounded-full bg-[var(--violet)]/20 text-[var(--violet)] border border-[var(--violet)]/40 font-bold">
                          #1 OPTIMAL FIT
                        </span>
                      )}
                      <span className="meta-label text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--text)] border border-white/10 font-bold">
                        {match.profile?.gender === 'female' ? 'FEMALE' : 'MALE'}
                      </span>
                    </div>

                    <div className="meta-label text-xs text-[var(--text-secondary)] truncate mb-2.5">
                      {match.profile?.headline}
                    </div>

                    {/* One-line Why */}
                    <p className="body-text text-xs sm:text-sm italic text-[var(--text)] max-w-xl mb-3.5 font-light">
                      &ldquo;{match.reason || 'High compatibility quotient powered by complementary ambition and sovereign lifestyle autonomy.'}&rdquo;
                    </p>

                    {/* Shared Traits Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(match.profile?.interests || ['Craft', 'Strategy', 'Creativity']).slice(0, 3).map((item: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text)]">
                          ✦ {item}
                        </span>
                      ))}

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        <span>Demanding calendars</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Replay CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--line)]">
                  <div className="text-right">
                    <div className="font-mono text-3xl sm:text-5xl font-bold text-[var(--magenta)]">
                      {match.score}%
                    </div>
                    <div className="meta-label text-[9px] text-[var(--text-secondary)] font-bold">COMPATIBILITY</div>
                  </div>

                  <Link
                    href={`/date/${person.id}/${match.id}`}
                    onClick={() => sounds.playClick()}
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] !text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:opacity-95 transition-opacity cursor-pointer shrink-0"
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
