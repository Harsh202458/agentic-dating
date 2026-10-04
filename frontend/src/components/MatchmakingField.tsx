'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '../utils/sound';

export interface PersonNode {
  id: number | string;
  name: string;
  headline: string;
  photo: string;
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
}

// Simplex-like 2D noise generator
function pseudoNoise(x: number, y: number, t: number): number {
  return Math.sin(x * 0.003 + t) * Math.cos(y * 0.003 + t * 0.8) +
         Math.sin((x + y) * 0.002 - t * 0.5) * 0.5;
}

export default function MatchmakingField({
  people,
  onSelectPerson,
  selectedPersonId
}: MatchmakingFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<PersonNode | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeToast, setActiveToast] = useState<{ pA: string; pB: string; score: number } | null>(null);

  // Camera state for spring centering
  const cameraRef = useRef({ x: 0, y: 0, scale: 1, targetX: 0, targetY: 0, targetScale: 1 });
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  const handleNodeClick = useCallback((person: PersonNode) => {
    sounds.playClick();
    if (onSelectPerson) {
      onSelectPerson(person);
    }
  }, [onSelectPerson]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle DPR
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Image Cache
    const imgCache = new Map<number | string, HTMLImageElement>();
    people.forEach(p => {
      if (p.photo) {
        const img = new Image();
        img.src = p.photo;
        img.crossOrigin = 'anonymous';
        imgCache.set(p.id, img);
      }
    });

    // 150-300 ambient particles
    const particleCount = isMobile ? 80 : 200;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.15 + 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15
    }));

    // Nodes initialization
    const displayPeople = isMobile ? people.slice(0, 14) : people;
    const nodes = displayPeople.map((person, i) => {
      const angle = (i / displayPeople.length) * Math.PI * 2;
      const dist = Math.min(window.innerWidth, window.innerHeight) * 0.35 + (Math.random() - 0.5) * 120;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      return {
        id: person.id,
        person,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: isMobile ? 18 : 22,
        pulse: Math.random() * Math.PI * 2,
        targetX: 0,
        targetY: 0
      };
    });

    // Connections and dynamic pair attraction
    interface ActiveLink {
      source: typeof nodes[0];
      target: typeof nodes[0];
      score: number;
      drawProgress: number; // 0 to 1
      life: number;
    }
    const activeLinks: ActiveLink[] = [];

    // Periodic organic connection pairing
    let pairInterval: NodeJS.Timeout;
    const triggerPair = () => {
      if (nodes.length < 2 || prefersReducedMotion) return;
      const idxA = Math.floor(Math.random() * nodes.length);
      const idxB = (idxA + Math.floor(Math.random() * (nodes.length - 1)) + 1) % nodes.length;
      const nA = nodes[idxA];
      const nB = nodes[idxB];
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
      setTimeout(() => setActiveToast(null), 3600);
    };

    pairInterval = setInterval(triggerPair, 9000);
    setTimeout(triggerPair, 2000);

    // Mouse and Pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Check hover
      const mx = e.clientX;
      const my = e.clientY;
      let hovered: typeof nodes[0] | null = null;

      for (const n of nodes) {
        // adjust for camera
        const screenX = (n.x - cameraRef.current.x) * cameraRef.current.scale + (window.innerWidth / 2) * (1 - cameraRef.current.scale);
        const screenY = (n.y - cameraRef.current.y) * cameraRef.current.scale + (window.innerHeight / 2) * (1 - cameraRef.current.scale);
        const d = Math.hypot(screenX - mx, screenY - my);
        if (d < n.radius + 12) {
          hovered = n;
          break;
        }
      }

      if (hovered) {
        setHoveredNode(hovered.person);
        setHoverPos({ x: mx, y: my });
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      for (const n of nodes) {
        const screenX = (n.x - cameraRef.current.x) * cameraRef.current.scale + (window.innerWidth / 2) * (1 - cameraRef.current.scale);
        const screenY = (n.y - cameraRef.current.y) * cameraRef.current.scale + (window.innerHeight / 2) * (1 - cameraRef.current.scale);
        const d = Math.hypot(screenX - mx, screenY - my);
        if (d < n.radius + 16) {
          // Camera target center
          cameraRef.current.targetX = n.x - window.innerWidth / 2;
          cameraRef.current.targetY = n.y - window.innerHeight / 2;
          cameraRef.current.targetScale = 1.25;
          handleNodeClick(n.person);
          break;
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('click', handleCanvasClick);

    // Render loop (60fps, DPR-aware, visibility-aware)
    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      time += prefersReducedMotion ? 0 : 0.008;

      // Soft mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Camera spring lerp
      const cam = cameraRef.current;
      cam.x += (cam.targetX - cam.x) * 0.06;
      cam.y += (cam.targetY - cam.y) * 0.06;
      cam.scale += (cam.targetScale - cam.scale) * 0.06;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Ambient Particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        ctx.fillStyle = `rgba(244, 244, 246, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Physics & Node Positions
      nodes.forEach(n => {
        if (!prefersReducedMotion) {
          // Simplex flow drift
          const flowAngle = pseudoNoise(n.x, n.y, time) * Math.PI * 2;
          n.vx += Math.cos(flowAngle) * 0.03;
          n.vy += Math.sin(flowAngle) * 0.03;

          // Parallax with pointer
          const mdx = n.x - mouseRef.current.x;
          const mdy = n.y - mouseRef.current.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 120 && mDist > 0) {
            const push = (120 - mDist) / 120;
            n.vx += (mdx / mDist) * push * 0.6;
            n.vy += (mdy / mDist) * push * 0.6;
          }

          // Damping
          n.vx *= 0.94;
          n.vy *= 0.94;
          n.x += n.vx;
          n.y += n.vy;

          // Soft soft screen bounds
          const pad = 60;
          if (n.x < pad) n.x = pad;
          if (n.x > window.innerWidth - pad) n.x = window.innerWidth - pad;
          if (n.y < pad) n.y = pad;
          if (n.y > window.innerHeight - pad) n.y = window.innerHeight - pad;
        }

        n.pulse += 0.04;
      });

      // 3. Draw Active Links with Curved Lines and Midpoint Badge
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

        const x1 = link.source.x;
        const y1 = link.source.y;
        const x2 = link.target.x;
        const y2 = link.target.y;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 25; // curved arch

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);

        const alpha = Math.min(1, link.life) * (link.drawProgress);
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Midpoint compatibility percentage badge
        if (link.drawProgress > 0.7) {
          ctx.font = '600 10px var(--font-geist-mono), monospace';
          ctx.fillStyle = `rgba(232, 121, 249, ${alpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${link.score}%`, (x1 + x2) / 2, (y1 + y2) / 2 - 14);
        }
        ctx.restore();
      }

      // 4. Render Nodes
      const isAnyHovered = hoveredNode !== null;

      nodes.forEach(n => {
        const isHovered = hoveredNode?.id === n.id;
        const isSelected = selectedPersonId === n.id;
        const scale = isHovered ? 1.18 : 1.0;
        const r = n.radius * scale;

        // Dim other nodes to 25% if one is hovered
        const nodeAlpha = isAnyHovered ? (isHovered ? 1.0 : 0.25) : 1.0;

        ctx.save();
        ctx.globalAlpha = nodeAlpha;

        // Avatar circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0E0E13';
        ctx.fill();

        // 1px hairline border
        ctx.strokeStyle = isHovered ? '#8B5CF6' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isHovered ? 2 : 1;
        if (isHovered) {
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 18;
        }
        ctx.stroke();

        // Clip and draw image
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r - 1, 0, Math.PI * 2);
        ctx.clip();

        const img = imgCache.get(n.id);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2);
        } else {
          ctx.fillStyle = '#14141B';
          ctx.fillRect(n.x - r, n.y - r, r * 2, r * 2);
          ctx.font = '600 11px sans-serif';
          ctx.fillStyle = '#F4F4F6';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.person.name.charAt(0), n.x, n.y);
        }
        ctx.restore();

        // Tiny breathing agent dot (top right)
        const agentDotAngle = -Math.PI / 4;
        const dotDist = r + 2;
        const dotX = n.x + Math.cos(agentDotAngle) * dotDist;
        const dotY = n.y + Math.sin(agentDotAngle) * dotDist;
        const dotPulse = 0.5 + Math.sin(n.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 8 * dotPulse;
        ctx.fill();

        // Name label on hover
        if (isHovered) {
          ctx.font = '600 12px sans-serif';
          ctx.fillStyle = '#F4F4F6';
          ctx.textAlign = 'center';
          ctx.fillText(n.person.name, n.x, n.y + r + 16);

          ctx.font = '10px var(--font-geist-mono), monospace';
          ctx.fillStyle = '#8A8A97';
          ctx.fillText(n.person.headline.slice(0, 24), n.x, n.y + r + 28);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pairInterval);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [people, hoveredNode, selectedPersonId, handleNodeClick]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Floating Hover Profile Preview beside cursor */}
      {hoveredNode && (
        <div
          className="fixed z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-6 transition-all duration-150"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="card-panel p-4 min-w-[260px] max-w-[300px] border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/15">
                <img src={hoveredNode.photo} alt={hoveredNode.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[var(--text)] truncate">{hoveredNode.name}</div>
                <div className="meta-label text-[10px] text-[var(--muted)] truncate">{hoveredNode.headline}</div>
              </div>
            </div>

            <div className="pt-2.5 space-y-1.5">
              <div className="meta-label text-[9px] text-[var(--violet)]">AGENT SIGNALS</div>
              <div className="flex flex-wrap gap-1">
                {(hoveredNode.interests || []).slice(0, 3).map((item, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--muted)]">Click to open report</span>
              <span className="text-[var(--magenta)] font-bold">EXAMINE →</span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Notification Toast */}
      {activeToast && (
        <div className="fixed top-24 right-8 z-50 animate-fade-in pointer-events-none">
          <div className="card-panel px-4 py-3 border border-[var(--violet)]/40 flex items-center gap-3 shadow-2xl backdrop-blur-2xl">
            <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
            <div>
              <div className="meta-label text-[9px] text-[var(--violet)] font-bold">
                AGENTS DISCOVERED A POTENTIAL MATCH
              </div>
              <div className="text-xs text-white mt-0.5 font-medium">
                {activeToast.pA} <span className="text-[var(--muted)]">×</span> {activeToast.pB}
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
