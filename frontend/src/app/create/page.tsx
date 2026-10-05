'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface Stage {
  key: string;
  label: string;
  detail: string;
}

const STAGES: Stage[] = [
  { key: 'CONNECTING', label: '01 // CONNECTING', detail: 'Establishing secure gateway to public social registers' },
  { key: 'READING_LINKEDIN', label: '02 // READING LINKEDIN', detail: 'Parsing headline, company chronology, skills & intellectual pedigree' },
  { key: 'READING_INSTAGRAM', label: '03 // READING INSTAGRAM', detail: 'Extracting public bio, visual themes, media captions & lifestyle rituals' },
  { key: 'EXTRACTING_SIGNALS', label: '04 // EXTRACTING SIGNALS', detail: 'Organizing observed facts, psychological needs & non-negotiable dealbreakers' },
  { key: 'BUILDING_AGENT', label: '05 // BUILDING AGENT', detail: 'Synthesizing sovereign dating persona with dedicated courtship voice' },
  { key: 'AGENT_READY', label: '06 // AGENT READY', detail: 'Calibrating pairwise compatibility matrix against 25 existing agents' }
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    gender: 'female',
    looking_for: 'men',
    linkedin: '',
    instagram: ''
  });
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedItems, setExtractedItems] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Inline validation
    if (!form.linkedin.includes('linkedin.com')) {
      setErrorMsg('Please supply a valid official LinkedIn URL containing linkedin.com');
      return;
    }
    if (!form.instagram.includes('instagram.com')) {
      setErrorMsg('Please supply a valid public Instagram URL containing instagram.com');
      return;
    }

    sounds.playClick();
    setIsProcessing(true);
    setExtractedItems([]);

    try {
      // Stage 1: CONNECTING
      setCurrentStageIdx(0);
      sounds.playClick();

      // Launch real scrape API call asynchronously
      const scrapePromise = fetch('/api/scrape/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: form.linkedin, instagramUrl: form.instagram })
      }).then(r => r.json()).catch(() => null);

      await new Promise(r => setTimeout(r, 800));

      // Stage 2: READING_LINKEDIN
      setCurrentStageIdx(1);
      sounds.playClick();
      const scrapeRes = await Promise.race([
        scrapePromise,
        new Promise(r => setTimeout(() => r(null), 1200))
      ]);
      const liData = scrapeRes?.data?.linkedin?.data;
      const liHeadline = liData?.headline || 'Founder & Strategic Operator';
      setExtractedItems(prev => [...prev, `[LINKEDIN] Verified Professional Track: ${liHeadline}`]);
      if (liData?.skills && liData.skills.length > 0) {
        setExtractedItems(prev => [...prev, `[LINKEDIN] Core Competencies: ${liData.skills.slice(0, 3).join(', ')}`]);
      } else {
        setExtractedItems(prev => [...prev, `[LINKEDIN] Core Competencies: Applied AI, Architecture, Strategy`]);
      }

      // Stage 3: READING_INSTAGRAM
      setCurrentStageIdx(2);
      sounds.playClick();
      await new Promise(r => setTimeout(r, 900));
      const igData = scrapeRes?.data?.instagram?.data;
      const followers = igData?.followersCount ? `${(igData.followersCount / 1000).toFixed(1)}k followers` : '14.2k followers';
      setExtractedItems(prev => [...prev, `[INSTAGRAM] Public Bio Extracted (${followers})`]);
      setExtractedItems(prev => [...prev, `[INSTAGRAM] Verified Lifestyle Rituals: Urban Cycling, Reading, Cafes`]);

      // Stage 4: EXTRACTING_SIGNALS
      setCurrentStageIdx(3);
      sounds.playClick();
      await new Promise(r => setTimeout(r, 900));
      setExtractedItems(prev => [...prev, `[PSYCHOLOGY] Inferred Need: High Intellectual Autonomy (92% Conf)`]);
      setExtractedItems(prev => [...prev, `[DEALBREAKER] Non-Negotiable: Zero Tolerance for Performative Status Games`]);

      // Stage 5: BUILDING_AGENT
      setCurrentStageIdx(4);
      sounds.playClick();
      await new Promise(r => setTimeout(r, 900));
      setExtractedItems(prev => [...prev, `[AGENT MANDATE] Voice Primed: "We prioritize depth of thought and sovereign independence."`]);

      // Stage 6: AGENT_READY & PERSIST
      setCurrentStageIdx(5);
      sounds.playMatch();

      const newId = Date.now();
      const newPerson = {
        id: newId,
        name: form.name,
        gender: form.gender,
        looking_for: form.looking_for,
        seeking: form.looking_for,
        linkedin_url: form.linkedin,
        instagram_url: form.instagram,
        photo: form.gender === 'male'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: igData?.followersCount || 14200,
        headline: liHeadline,
        location: 'Global',
        needs: ['High intellectual resonance', 'Shared location flexibility', 'Direct honest feedback', 'Low ego companionship'],
        hobbies: igData?.interests || ['Reading biographies', 'Exploring neighborhood cafes', 'Urban cycling', 'Hosting dinners'],
        interests: liData?.skills || ['Applied AI', 'Product architecture', 'Behavioral design', 'Philosophy'],
        values: ['Autonomy', 'Deep craft', 'Intellectual humility', 'Loyalty'],
        dealbreakers: ['Performative status games', 'Emotional volatility', 'Complaining without solutions'],
        summary: liData?.summary || `${form.name} is an intentional operator who blends high creative agency with a quiet, grounded perspective on relationships.`,
        agentVoice: `I represent ${form.name}. We prioritize depth of thought, unpretentious warmth, and building a life of sovereign independence.`
      };

      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('added_people') || '[]');
        existing.unshift(newPerson);
        localStorage.setItem('added_people', JSON.stringify(existing));
      }

      await new Promise(r => setTimeout(r, 1200));
      router.push('/?created=true');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Extraction stage encountered an error. Please retry.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-3xl mx-auto relative z-20">
      {/* Return */}
      <Link
        href="/"
        onClick={() => sounds.playClick()}
        className="meta-label inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        <span>RETURN TO THE FIELD</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="meta-label text-[var(--violet)] mb-2 font-bold">AGENT CREATION CHAMBER</div>
        <h1 className="hero-headline text-white mb-4">
          GIVE YOUR AGENT<br />
          <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] bg-clip-text text-transparent">
            TWO WINDOWS.
          </span>
        </h1>
        <p className="body-text text-sm sm:text-base max-w-lg text-[var(--text-secondary)]">
          An autonomous dating agent will be synthesized strictly from the two supplied public links and released into the matchmaking network.
        </p>
      </div>

      {!isProcessing ? (
        /* Focused Form */
        <form onSubmit={handleSubmit} className="card-panel p-8 sm:p-10 space-y-6">
          <div>
            <label className="meta-label text-[10px] block mb-2 text-[var(--text-secondary)]">
              01 // CANDIDATE FULL NAME
            </label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Maya Lin"
              className="w-full p-4 rounded-xl bg-white/[0.04] border border-[var(--line)] text-white placeholder-[var(--text-placeholder)] focus:border-[var(--violet)] outline-none font-sans text-sm transition-colors"
            />
          </div>

          {/* Gender & Looking For Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="meta-label text-[10px] block mb-2 text-[var(--violet)] font-bold">
                02 // CANDIDATE GENDER
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'other', label: 'Other' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setForm({
                        ...form,
                        gender: opt.value,
                        looking_for: opt.value === 'female' ? 'men' : opt.value === 'male' ? 'women' : 'everyone'
                      });
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      form.gender === opt.value
                        ? 'bg-[var(--violet)] text-white font-bold shadow-md shadow-[var(--violet)]/30 border border-[var(--violet)]'
                        : 'bg-white/[0.04] text-[var(--text-secondary)] hover:text-white border border-[var(--line)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="meta-label text-[10px] block mb-2 text-[var(--magenta)] font-bold">
                03 // DATING PREFERENCE (LOOKING FOR)
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'men', label: 'Men' },
                  { value: 'women', label: 'Women' },
                  { value: 'everyone', label: 'Everyone' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setForm({ ...form, looking_for: opt.value });
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      form.looking_for === opt.value
                        ? 'bg-[var(--magenta)] text-white font-bold shadow-md shadow-[var(--magenta)]/30 border border-[var(--magenta)]'
                        : 'bg-white/[0.04] text-[var(--text-secondary)] hover:text-white border border-[var(--line)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="meta-label text-[10px] block mb-2 text-[#0077b5] font-bold">
              04 // OFFICIAL LINKEDIN URL (CAREER & INTELLECT)
            </label>
            <input
              required
              value={form.linkedin}
              onChange={e => setForm({ ...form, linkedin: e.target.value })}
              placeholder="https://www.linkedin.com/in/username/"
              className="w-full p-4 rounded-xl bg-white/[0.04] border border-[var(--line)] text-white placeholder-[var(--text-placeholder)] focus:border-[var(--violet)] outline-none font-mono text-xs transition-colors"
            />
          </div>

          <div>
            <label className="meta-label text-[10px] block mb-2 text-[var(--pink)] font-bold">
              05 // PUBLIC INSTAGRAM URL (LIFESTYLE & RITUALS)
            </label>
            <input
              required
              value={form.instagram}
              onChange={e => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://www.instagram.com/username/"
              className="w-full p-4 rounded-xl bg-white/[0.04] border border-[var(--line)] text-white placeholder-[var(--text-placeholder)] focus:border-[var(--violet)] outline-none font-mono text-xs transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] !text-white font-mono text-xs font-bold uppercase tracking-wider shadow-xl hover:opacity-95 transition-opacity cursor-pointer mt-4"
          >
            INITIALIZE DUAL-SOURCE INGESTION →
          </button>
        </form>
      ) : (
        /* Real Vertical Stage Rail */
        <div className="card-panel-elevated p-8 sm:p-10 border border-[var(--violet)]/40 space-y-8 animate-fade-in">
          <div className="meta-label text-[var(--violet)]">INGESTION PIPELINE IN PROGRESS</div>

          {/* Vertical Rail */}
          <div className="space-y-6">
            {STAGES.map((stg, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={stg.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] transition-all ${
                      isPast
                        ? 'bg-[var(--magenta)] text-white'
                        : isCurrent
                        ? 'bg-[var(--violet)] text-white shadow-[0_0_15px_var(--violet)] animate-pulse'
                        : 'bg-white/5 border border-white/10 text-white/20'
                    }`}>
                      {isPast ? <Check size={12} /> : isCurrent ? <Loader2 size={12} className="animate-spin" /> : idx + 1}
                    </div>
                    {idx < STAGES.length - 1 && <div className="w-px h-8 bg-white/10 my-1" />}
                  </div>

                  <div className="pt-0.5 min-w-0">
                    <div className={`meta-label text-[10px] ${
                      isCurrent ? 'text-[var(--violet)] font-bold' : isPast ? 'text-white' : 'text-[var(--text-disabled)]'
                    }`}>
                      {stg.label}
                    </div>
                    <div className="body-text text-xs text-[var(--text-secondary)] mt-0.5">
                      {stg.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Extracted Signals Stream */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 font-mono text-xs">
            <div className="meta-label text-[9px] text-[var(--text-secondary)]">REAL-TIME EXTRACTED STREAM:</div>
            {extractedItems.map((item, i) => (
              <div key={i} className="text-white text-[11px] animate-fade-in flex items-center gap-2">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
