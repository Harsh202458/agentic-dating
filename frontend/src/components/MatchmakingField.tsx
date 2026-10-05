'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '../utils/sound';
import { isPairEligible } from '../utils/matching';
import SocialBadges from './SocialBadges';

export interface PersonNode {
  id: number | string;
  name: string;
  headline: string;
  photo: string;
  gender?: 'male' | 'female' | 'other' | string;
  looking_for?: 'men' | 'women' | 'everyone' | string;
  seeking?: 'men' | 'women' | 'everyone' | string;
  location?: string;
  followers?: number;
  interests?: string[];
  hobbies?: string[];
  values?: string[];
  needs?: string[];
  dealbreakers?: string[];
  agentVoice?: string;
  summary?: string;
  observed_facts?: string[];
  inferred_traits?: { trait: string; rationale: string; confidence: string }[];
  unknown_factors?: string[];
  linkedin_url?: string;
  instagram_url?: string;
}

interface MatchmakingFieldProps {
  people: PersonNode[];
  onSelectPerson?: (person: PersonNode) => void;
  selectedPersonId?: number | string | null;
  ambientOnly?: boolean;
}

// Lightweight fast pseudo-noise
function pseudoNoise(x: number, y: number, t: number): number {
  return Math.sin(x * 0.003 + t) * Math.cos(y * 0.003 + t * 0.8) +
         Math.sin((x + y) * 0.002 - t * 0.5) * 0.5;
}

export default function MatchmakingField({
  people,
  onSelectPerson,
  selectedPersonId,
  ambientOnly = false
}: MatchmakingFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<PersonNode | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeToast, setActiveToast] = useState<{ pA: string; pB: string; score: number } | null>(null);

  // Synchronous refs for 60fps rendering without React re-render lag
  const hoveredIdRef = useRef<number | string | null>(null);
  const selectedPersonIdRef = useRef<number | string | null>(selectedPersonId || null);
  const cameraRef = useRef({ x: 0, y: 0, scale: 1, targetX: 0, targetY: 0, targetScale: 1 });
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    selectedPersonIdRef.current = selectedPersonId || null;
  }, [selectedPersonId]);

  const handleNodeClick = useCallback((person: PersonNode) => {
    sounds.playClick();
    if (onSelectPerson) {
      onSelectPerson(person);
    }
  }, [onSelectPerson]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll listener for smooth parallax & camera depth
    const handleScroll = () => {
      const sy = window.scrollY || 0;
      scrollYRef.current = sy;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgressRef.current = Math.min(1, Math.max(0, sy / maxScroll));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Handle DPR capped to 1.5 to guarantee 60fps without GPU throttling
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Ambient particles: lightweight and subtle
    const particleCount = ambientOnly ? 35 : (isMobile ? 40 : 70);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.0 + 0.5,
      alpha: Math.random() * 0.12 + 0.04,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15
    }));

    // If ambient-only, run ultra-light particle loop and return
    if (ambientOnly) {
      const renderAmbient = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(renderAmbient);
          return;
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = 'rgba(244, 244, 246, 0.1)';
        particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = window.innerWidth;
          if (p.x > window.innerWidth) p.x = 0;
          if (p.y < 0) p.y = window.innerHeight;
          if (p.y > window.innerHeight) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        animId = requestAnimationFrame(renderAmbient);
      };
      renderAmbient();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // Preload image cache once
    const imgCache = new Map<number | string, HTMLImageElement>();
    people.forEach(p => {
      if (p.photo) {
        const img = new Image();
        img.src = p.photo;
        img.crossOrigin = 'anonymous';
        imgCache.set(p.id, img);
      }
    });

    // Initialize Nodes positioned initially around the perimeter (leaving center clear)
    const displayPeople = isMobile ? people.slice(0, 12) : people;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const centerX = w / 2;
    const centerY = h / 2;

    const nodes = displayPeople.map((person, i) => {
      const angle = (i / displayPeople.length) * Math.PI * 2;
      const baseDist = Math.min(w, h) * 0.38;
      const dist = baseDist + ((i % 3) - 1) * 45;

      return {
        id: person.id,
        person,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        depth: 0.15 + (i % 3) * 0.08,
        radius: isMobile ? 18 : 22,
        pulse: Math.random() * Math.PI * 2
      };
    });

    // Connections and dynamic pair attraction
    interface ActiveLink {
      source: typeof nodes[0];
      target: typeof nodes[0];
      score: number;
      drawProgress: number;
      life: number;
    }
    const activeLinks: ActiveLink[] = [];

    // Periodic organic connection pairing (every 10s) - ONLY BETWEEN ELIGIBLE PAIRS
    let pairInterval: NodeJS.Timeout;
    const triggerPair = () => {
      if (nodes.length < 2 || prefersReducedMotion) return;
      const idxA = Math.floor(Math.random() * nodes.length);
      const nA = nodes[idxA];

      // Strictly select an eligible opposite-gender partner
      const eligible = nodes.filter(nB => nB.id !== nA.id && isPairEligible(nA.person, nB.person));
      if (eligible.length === 0) return;

      const nB = eligible[Math.floor(Math.random() * eligible.length)];
      const score = Math.floor(84 + Math.random() * 13);

      activeLinks.push({
        source: nA,
        target: nB,
        score,
        drawProgress: 0,
        life: 1.0
      });

      sounds.playConnect();

      setActiveToast({
        pA: nA.person.name,
        pB: nB.person.name,
        score
      });
      setTimeout(() => setActiveToast(null), 3500);
    };

    pairInterval = setInterval(triggerPair, 10000);
    const initialPairTimeout = setTimeout(triggerPair, 2500);

    // Mouse Tracking (debounced React updates to eliminate render lag)
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      const mx = e.clientX;
      const my = e.clientY;
      let found: typeof nodes[0] | null = null;

      for (const n of nodes) {
        const screenX = (n.x - cameraRef.current.x) * cameraRef.current.scale + (window.innerWidth / 2) * (1 - cameraRef.current.scale);
        const screenY = (n.y - (scrollYRef.current * n.depth) - cameraRef.current.y) * cameraRef.current.scale + (window.innerHeight / 2) * (1 - cameraRef.current.scale);
        const d = Math.hypot(screenX - mx, screenY - my);
        if (d < n.radius + 14) {
          found = n;
          break;
        }
      }

      const nextId = found ? found.id : null;
      if (hoveredIdRef.current !== nextId) {
        hoveredIdRef.current = nextId;
        setHoveredNode(found ? found.person : null);
        canvas.style.cursor = found ? 'pointer' : 'default';
      }

      if (found) {
        setHoverPos({ x: mx, y: my });
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      for (const n of nodes) {
        const screenX = (n.x - cameraRef.current.x) * cameraRef.current.scale + (window.innerWidth / 2) * (1 - cameraRef.current.scale);
        const screenY = (n.y - (scrollYRef.current * n.depth) - cameraRef.current.y) * cameraRef.current.scale + (window.innerHeight / 2) * (1 - cameraRef.current.scale);
        const d = Math.hypot(screenX - mx, screenY - my);
        if (d < n.radius + 18) {
          cameraRef.current.targetX = n.x - window.innerWidth / 2;
          cameraRef.current.targetY = n.y - (scrollYRef.current * n.depth) - window.innerHeight / 2;
          cameraRef.current.targetScale = 1.15;
          handleNodeClick(n.person);
          break;
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('click', handleCanvasClick);

    // Optimized Render loop (60fps steady)
    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      time += prefersReducedMotion ? 0 : 0.006;

      // Mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Camera lerp tied to scroll & target
      const cam = cameraRef.current;
      if (selectedPersonIdRef.current === null) {
        cam.targetY = scrollYRef.current * 0.12;
        cam.targetScale = Math.max(0.92, 1.0 - scrollProgressRef.current * 0.08);
      }
      cam.x += (cam.targetX - cam.x) * 0.05;
      cam.y += (cam.targetY - cam.y) * 0.05;
      cam.scale += (cam.targetScale - cam.scale) * 0.05;

      const curW = window.innerWidth;
      const curH = window.innerHeight;
      const curCenterX = curW / 2;
      const curCenterY = curH / 2;

      ctx.clearRect(0, 0, curW, curH);

      // 1. Ambient Particles
      ctx.fillStyle = 'rgba(244, 244, 246, 0.12)';
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = curW;
        if (p.x > curW) p.x = 0;
        if (p.y < 0) p.y = curH;
        if (p.y > curH) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle dark gradient overlay increasing as user scrolls down into content
      const scrollOverlayAlpha = Math.min(0.72, scrollProgressRef.current * 0.85);
      if (scrollOverlayAlpha > 0.02) {
        ctx.fillStyle = `rgba(7, 7, 10, ${scrollOverlayAlpha})`;
        ctx.fillRect(0, 0, curW, curH);
      }

      // 2. Physics & Node Movement with Anti-Overlap Forces
      const minCenterDist = isMobile ? 180 : 310; // Hero text exclusion zone

      nodes.forEach((n, i) => {
        if (!prefersReducedMotion) {
          // Flow drift
          const flowAngle = pseudoNoise(n.x, n.y, time) * Math.PI * 2;
          n.vx += Math.cos(flowAngle) * 0.02;
          n.vy += Math.sin(flowAngle) * 0.02;

          // Repulsion from screen center (protects hero text from being obscured)
          const cdx = n.x - curCenterX;
          const cdy = n.y - curCenterY;
          const cDist = Math.hypot(cdx, cdy);
          if (cDist < minCenterDist && cDist > 0) {
            const push = ((minCenterDist - cDist) / minCenterDist) * 0.12;
            n.vx += (cdx / cDist) * push;
            n.vy += (cdy / cDist) * push;
          }

          // Node-to-node collision repulsion (guarantees nodes NEVER overlap each other)
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = n.x - other.x;
            const dy = n.y - other.y;
            const dist = Math.hypot(dx, dy);
            const minDist = n.radius + other.radius + 38;
            if (dist < minDist && dist > 0) {
              const repelForce = ((minDist - dist) / minDist) * 0.08;
              const rfx = (dx / dist) * repelForce;
              const rfy = (dy / dist) * repelForce;
              n.vx += rfx;
              n.vy += rfy;
              other.vx -= rfx;
              other.vy -= rfy;
            }
          }

          // Pointer parallax repulsion
          const mdx = n.x - mouseRef.current.x;
          const mdy = n.y - mouseRef.current.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 110 && mDist > 0) {
            const push = ((110 - mDist) / 110) * 0.4;
            n.vx += (mdx / mDist) * push;
            n.vy += (mdy / mDist) * push;
          }

          // Damping & Position update
          n.vx *= 0.93;
          n.vy *= 0.93;
          n.x += n.vx;
          n.y += n.vy;

          // Boundary containment
          const pad = 65;
          if (n.x < pad) { n.x = pad; n.vx = Math.abs(n.vx) * 0.5; }
          if (n.x > curW - pad) { n.x = curW - pad; n.vx = -Math.abs(n.vx) * 0.5; }
          if (n.y < pad) { n.y = pad; n.vy = Math.abs(n.vy) * 0.5; }
          if (n.y > curH - pad) { n.y = curH - pad; n.vy = -Math.abs(n.vy) * 0.5; }
        }

        n.pulse += 0.04;
      });

      // 3. Draw Active Links
      for (let i = activeLinks.length - 1; i >= 0; i--) {
        const link = activeLinks[i];
        if (link.drawProgress < 1) {
          link.drawProgress += 0.03;
        } else {
          link.life -= 0.003;
        }

        if (link.life <= 0) {
          activeLinks.splice(i, 1);
          continue;
        }

        const x1 = (link.source.x - cam.x) * cam.scale + curCenterX * (1 - cam.scale);
        const y1 = (link.source.y - (scrollYRef.current * link.source.depth) - cam.y) * cam.scale + curCenterY * (1 - cam.scale);
        const x2 = (link.target.x - cam.x) * cam.scale + curCenterX * (1 - cam.scale);
        const y2 = (link.target.y - (scrollYRef.current * link.target.depth) - cam.y) * cam.scale + curCenterY * (1 - cam.scale);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 20;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);

        const alpha = Math.min(1, link.life) * link.drawProgress;
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Midpoint badge
        if (link.drawProgress > 0.7) {
          ctx.font = '600 11px monospace';
          ctx.fillStyle = `rgba(232, 121, 249, ${alpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${link.score}%`, midX, midY + 6);
        }
        ctx.restore();
      }

      // 4. Render Nodes with Depth Parallax
      const currentHoverId = hoveredIdRef.current;
      const isAnyHovered = currentHoverId !== null;

      nodes.forEach(n => {
        const isHovered = currentHoverId === n.id;
        const scale = isHovered ? 1.15 : 1.0;
        const r = n.radius * scale;
        const nodeAlpha = isAnyHovered ? (isHovered ? 1.0 : 0.25) : 1.0;

        const drawX = (n.x - cam.x) * cam.scale + curCenterX * (1 - cam.scale);
        const drawY = (n.y - (scrollYRef.current * n.depth) - cam.y) * cam.scale + curCenterY * (1 - cam.scale);

        ctx.save();
        ctx.globalAlpha = nodeAlpha;

        // Background circle
        ctx.beginPath();
        ctx.arc(drawX, drawY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0E0E13';
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? '#8B5CF6' : 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Avatar Clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY, r - 1, 0, Math.PI * 2);
        ctx.clip();

        const img = imgCache.get(n.id);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, drawX - r, drawY - r, r * 2, r * 2);
        } else {
          ctx.fillStyle = '#14141B';
          ctx.fillRect(drawX - r, drawY - r, r * 2, r * 2);
          ctx.fillStyle = '#F4F4F6';
          ctx.font = '600 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.person.name.charAt(0), drawX, drawY);
        }
        ctx.restore();

        // Agent Dot
        const dotAngle = -Math.PI / 4;
        const dotDist = r + 2;
        const dotX = drawX + Math.cos(dotAngle) * dotDist;
        const dotY = drawY + Math.sin(dotAngle) * dotDist;

        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pairInterval);
      clearTimeout(initialPairTimeout);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [people, ambientOnly, handleNodeClick]);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${ambientOnly ? 'pointer-events-none opacity-25' : 'pointer-events-auto'}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Floating Hover Profile Preview (safely placed to never overlap navbar or go off-screen) */}
      {!ambientOnly && hoveredNode && (
        <div
          className={`fixed z-40 pointer-events-none transform -translate-x-1/2 transition-all duration-100 ${
            hoverPos.y < 220 ? 'translate-y-8' : '-translate-y-full mb-6'
          }`}
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="card-panel p-4 min-w-[260px] max-w-[300px] border border-white/15 shadow-2xl backdrop-blur-xl bg-[var(--surface)]/95">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
                <img src={hoveredNode.photo} alt={hoveredNode.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[var(--text)] truncate">{hoveredNode.name}</div>
                <div className="meta-label text-[10px] text-[var(--text-secondary)] truncate">{hoveredNode.headline}</div>
              </div>
            </div>

            <div className="pt-2.5 space-y-1.5">
              <div className="meta-label text-[9px] text-[var(--violet)] font-bold">AGENT SIGNALS</div>
              <div className="flex flex-wrap gap-1">
                {(hoveredNode.interests || []).slice(0, 3).map((item, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-[var(--text)]">
                    {item}
                  </span>
                ))}
              </div>
              <div className="pt-1 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <SocialBadges
                  linkedinUrl={hoveredNode.linkedin_url}
                  instagramUrl={hoveredNode.instagram_url}
                  size="sm"
                />
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--text-secondary)]">Click to open report</span>
              <span className="text-[var(--magenta)] font-bold">EXAMINE →</span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Notification Toast */}
      {!ambientOnly && activeToast && (
        <div className="fixed top-24 right-8 z-50 animate-fade-in pointer-events-none">
          <div className="card-panel px-4 py-3 border border-[var(--violet)]/50 flex items-center gap-3 shadow-2xl backdrop-blur-2xl bg-[var(--surface)]/95">
            <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
            <div>
              <div className="meta-label text-[9px] text-[var(--violet)] font-bold tracking-wider">
                AGENTS DISCOVERED A POTENTIAL MATCH
              </div>
              <div className="text-xs text-[var(--text)] mt-0.5 font-medium">
                {activeToast.pA} <span className="text-[var(--text-secondary)]">×</span> {activeToast.pB}
              </div>
            </div>
            <div className="meta-label text-base font-bold text-[var(--magenta)] ml-2">
              {activeToast.score}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
