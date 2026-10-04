'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MatchmakingField, { PersonNode } from './MatchmakingField';
import ProfileSideSheet from './ProfileSideSheet';
import { useRouter, usePathname } from 'next/navigation';

import { getDataUrl } from '../utils/paths';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<PersonNode[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonNode | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isDatePage = pathname?.includes('/date/');
  const isHome = pathname === '/' || pathname === '' || pathname === '/agentic-dating/' || pathname === '/agentic-dating';
  const isAmbient = !isHome;

  useEffect(() => {
    fetch(getDataUrl('data/profiles_analyzed.json'))
      .then(res => res.json())
      .then(data => {
        if (typeof window !== 'undefined') {
          const added = JSON.parse(localStorage.getItem('added_people') || '[]');
          setPeople([...added, ...data]);
        } else {
          setPeople(data);
        }
      })
      .catch(console.error);
  }, []);

  // Demo Tour sequence handler
  const handleStartDemoTour = () => {
    if (people.length === 0) return;
    // Step 1: Open profile of person 1
    setSelectedPerson(people[0]);

    // Step 2: after 4s, navigate to date arena
    setTimeout(() => {
      setSelectedPerson(null);
      router.push('/date/1/14/');
    }, 4500);

    // Step 3: after 12s, navigate to rankings
    setTimeout(() => {
      router.push('/rankings/1/');
    }, 12500);

    // Step 4: after 18s, navigate to create
    setTimeout(() => {
      router.push('/create/');
    }, 18500);
  };

  return (
    <div className="relative min-h-screen">
      {/* Persistent Matchmaking Field in Background */}
      <MatchmakingField
        people={people}
        onSelectPerson={p => setSelectedPerson(p)}
        selectedPersonId={selectedPerson?.id}
        ambientOnly={isAmbient}
      />

      {/* Floating Navbar (hidden on full-screen Date Arena to eliminate header overlap) */}
      {!isDatePage && <Navbar onStartDemoTour={handleStartDemoTour} />}

      {/* Page Content */}
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>

      {/* Profile Side-Sheet (never leaves the field) */}
      <ProfileSideSheet
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        allPeople={people}
      />
    </div>
  );
}
