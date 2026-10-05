import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070A] text-[#F4F4F6] flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="w-12 h-12 rounded-full bg-[var(--violet)]/20 border border-[var(--violet)]/40 flex items-center justify-center text-[var(--violet)] mb-4 animate-pulse">
        404
      </div>
      <h2 className="text-xl font-bold mb-2">CHAMBER NOT FOUND</h2>
      <p className="text-xs text-[#B4B4C0] max-w-sm mb-6">
        The requested date encounter or participant profile does not exist in the active cohort.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--magenta)] text-white text-xs font-bold hover:brightness-110 transition-all"
      >
        RETURN TO DISCOVER
      </Link>
    </div>
  );
}
