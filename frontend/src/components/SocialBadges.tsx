'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export function normalizeLinkedInUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/linkedin\.com\/in\/([^\/\?#]+)/i);
  if (match) {
    return `https://www.linkedin.com/in/${match[1]}/`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://www.linkedin.com/in/${trimmed.replace(/^@/, '')}/`;
}

export function normalizeInstagramUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/instagram\.com\/([^\/\?#]+)/i);
  if (match) {
    return `https://www.instagram.com/${match[1]}/`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://www.instagram.com/${trimmed.replace(/^@/, '')}/`;
}

export function extractLinkedInSlug(url?: string): string {
  if (!url) return '';
  const match = url.match(/linkedin\.com\/in\/([^\/\?#]+)/i);
  return match ? match[1] : '';
}

export function extractInstagramHandle(url?: string): string {
  if (!url) return '';
  const match = url.match(/instagram\.com\/([^\/\?#]+)/i);
  return match ? match[1] : '';
}

interface SocialBadgesProps {
  linkedinUrl?: string;
  instagramUrl?: string;
  size?: 'sm' | 'md';
  className?: string;
  showHandles?: boolean;
}

export default function SocialBadges({
  linkedinUrl,
  instagramUrl,
  size = 'md',
  className = '',
  showHandles = true
}: SocialBadgesProps) {
  const normLi = normalizeLinkedInUrl(linkedinUrl);
  const normIg = normalizeInstagramUrl(instagramUrl);
  const liSlug = extractLinkedInSlug(normLi);
  const igHandle = extractInstagramHandle(normIg);

  const isSmall = size === 'sm';

  return (
    <div
      className={`flex flex-wrap items-center gap-2 pointer-events-auto ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* LinkedIn Badge */}
      {normLi ? (
        <a
          href={normLi}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`rounded-full bg-white/5 hover:bg-white/10 border border-white/15 font-mono text-[var(--text)] flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${
            isSmall ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
          }`}
          title={`Open verified LinkedIn profile: ${normLi}`}
        >
          <span className="text-[#0077b5] font-bold">LINKEDIN</span>
          {showHandles && liSlug && (
            <span className="text-[var(--text-secondary)] font-medium">in/{liSlug}</span>
          )}
          <ExternalLink size={isSmall ? 10 : 11} className="text-[var(--text-secondary)] shrink-0" />
        </a>
      ) : (
        <span
          className={`rounded-full bg-white/5 border border-white/10 font-mono text-[var(--text-disabled)] ${
            isSmall ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
          }`}
        >
          LINKEDIN · NOT AVAILABLE
        </span>
      )}

      {/* Instagram Badge */}
      {normIg ? (
        <a
          href={normIg}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`rounded-full bg-white/5 hover:bg-white/10 border border-white/15 font-mono text-[var(--text)] flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${
            isSmall ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
          }`}
          title={`Open verified Instagram profile: ${normIg}`}
        >
          <span className="text-[var(--pink)] font-bold">IG</span>
          {showHandles && igHandle && (
            <span className="text-[var(--text-secondary)] font-medium">@{igHandle}</span>
          )}
          <ExternalLink size={isSmall ? 10 : 11} className="text-[var(--text-secondary)] shrink-0" />
        </a>
      ) : (
        <span
          className={`rounded-full bg-white/5 border border-white/10 font-mono text-[var(--text-disabled)] ${
            isSmall ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
          }`}
        >
          INSTAGRAM · NOT AVAILABLE
        </span>
      )}
    </div>
  );
}
