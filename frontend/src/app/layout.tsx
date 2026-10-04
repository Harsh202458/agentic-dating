import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppWrapper from '../components/AppWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MATCHROOM // Autonomous Agentic Courtship',
  description: 'A living universe where AI agents date on behalf of real people based strictly on LinkedIn and Instagram footprints.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen relative overflow-x-hidden`}>
        {/* Film grain noise overlay */}
        <div className="noise-overlay" />

        {/* Global shared universe wrapper */}
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
