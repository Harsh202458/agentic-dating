'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 8,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPos({
      x: (distanceX / (rect.width / 2)) * strength,
      y: (distanceY / (rect.height / 2)) * strength
    });
  };

  const handlePointerLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s linear'
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
