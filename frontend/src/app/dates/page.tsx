'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DatesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dates/1-14');
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text-secondary)] font-mono">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--violet)] animate-ping" />
        <span>ENTERING DATE ARENA...</span>
      </div>
    </div>
  );
}
