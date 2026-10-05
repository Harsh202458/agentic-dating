'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, Sparkles, Plus, Play } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NavbarProps {
  onStartDemoTour?: () => void;
}

export default function Navbar({ onStartDemoTour }: NavbarProps) {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    setSoundOn(sounds.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = sounds.toggle();
    setSoundOn(next);
  };

  return (
    <>
      {/* Top subtle scrim gradient so scrolled content fades smoothly beneath the navbar */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/80 to-transparent pointer-events-none z-30" />

      <nav className="fixed top-5 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Floating Glass Pill Nav */}
          <div className="glass-pill px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-4 sm:gap-6 shadow-2xl border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-2xl">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-2 group"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--violet)] to-[var(--magenta)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="font-semibold text-xs tracking-widest text-[var(--text)] uppercase font-mono">
                MATCHROOM
              </span>
            </Link>

            {/* Links */}
            <div className="hidden sm:flex items-center gap-1 meta-label text-[10px]">
              <Link
                href="/"
                onClick={() => sounds.playClick()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname === '/' ? 'text-white bg-white/10 font-bold' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                DISCOVER
              </Link>
              <Link
                href="/#cohort"
                onClick={() => sounds.playClick()}
                className="px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                PEOPLE
              </Link>
              <Link
                href="/date/1/14"
                onClick={() => sounds.playClick()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname?.startsWith('/date') ? 'text-white bg-white/10 font-bold' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                DATES
              </Link>
              <Link
                href="/rankings/1"
                onClick={() => sounds.playClick()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname?.startsWith('/rankings') ? 'text-white bg-white/10 font-bold' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                MATCHES
              </Link>
            </div>
          </div>

          {/* Right Tools: Sound Toggle, Demo Tour, Create Agent */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="glass-pill w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer bg-[var(--surface)]/90"
              title={soundOn ? 'Sound On' : 'Sound Off'}
              aria-label="Toggle Sound"
            >
              {soundOn ? <Volume2 size={15} className="text-[var(--violet)]" /> : <VolumeX size={15} />}
            </button>

            {/* Demo Tour Button */}
            {onStartDemoTour && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onStartDemoTour();
                }}
                className="hidden md:flex glass-pill px-4 py-2 rounded-full items-center gap-1.5 meta-label text-[10px] text-[var(--magenta)] hover:bg-white/10 transition-colors cursor-pointer bg-[var(--surface)]/90"
              >
                <Sparkles size={12} />
                <span>DEMO TOUR</span>
              </button>
            )}

            {/* + Create Agent */}
            <Link
              href="/create"
              onClick={() => sounds.playClick()}
              className="glass-pill px-3.5 sm:px-4 py-2 rounded-full flex items-center gap-1.5 font-mono text-[10px] font-bold !text-white bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] hover:opacity-95 transition-opacity shadow-lg"
            >
              <Plus size={12} />
              <span className="hidden xs:inline">CREATE AGENT</span>
              <span className="xs:hidden">AGENT</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
