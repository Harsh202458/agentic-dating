'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import MatchmakingField, { PersonNode } from './MatchmakingField';
import ProfileSideSheet from './ProfileSideSheet';
import PairPickerModal from './PairPickerModal';
import { useRouter, usePathname } from 'next/navigation';
import { getDataUrl } from '../utils/paths';
import { sounds } from '../utils/sound';

export const PairPickerContext = React.createContext<{
  openPairPicker: (agentA?: PersonNode | null, agentB?: PersonNode | null) => void;
  closePairPicker: () => void;
}>({
  openPairPicker: () => {},
  closePairPicker: () => {}
});

export function usePairPicker() {
  return React.useContext(PairPickerContext);
}

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<PersonNode[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonNode | null>(null);
  const [isPairPickerOpen, setIsPairPickerOpen] = useState(false);
  const [pairPickerA, setPairPickerA] = useState<PersonNode | null>(null);
  const [pairPickerB, setPairPickerB] = useState<PersonNode | null>(null);

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

  const openPairPicker = useCallback((a?: PersonNode | null, b?: PersonNode | null) => {
    if (a) setPairPickerA(a);
    if (b) setPairPickerB(b);
    setIsPairPickerOpen(true);
  }, []);

  const closePairPicker = useCallback(() => {
    setIsPairPickerOpen(false);
  }, []);

  const handleSelectPersonFromField = (person: PersonNode) => {
    if (selectedPerson && String(selectedPerson.id) !== String(person.id)) {
      // Second node clicked! Launch Date Any Two People / Pair Picker modal with both agents!
      sounds.playConnect();
      setSelectedPerson(null);
      openPairPicker(selectedPerson, person);
    } else {
      setSelectedPerson(person);
    }
  };

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
    <PairPickerContext.Provider value={{ openPairPicker, closePairPicker }}>
      <div className="relative min-h-screen">
        {/* Persistent Matchmaking Field in Background */}
        <MatchmakingField
          people={people}
          onSelectPerson={handleSelectPersonFromField}
          selectedPersonId={selectedPerson?.id}
          ambientOnly={isAmbient}
        />

        {/* Floating Navbar (hidden on full-screen Date Arena to eliminate header overlap) */}
        {!isDatePage && (
          <Navbar
            onStartDemoTour={handleStartDemoTour}
            onOpenPairPicker={() => openPairPicker()}
          />
        )}

        {/* Page Content */}
        <div className="relative z-10 pointer-events-auto">
          {children}
        </div>

        {/* Profile Side-Sheet (never leaves the field) */}
        <ProfileSideSheet
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          allPeople={people}
          onDateSomeone={(p) => {
            setSelectedPerson(null);
            openPairPicker(p);
          }}
        />

        {/* Global Manual Matchmaker: Date Any Two People */}
        <PairPickerModal
          isOpen={isPairPickerOpen}
          onClose={closePairPicker}
          allPeople={people}
          initialAgentA={pairPickerA}
          initialAgentB={pairPickerB}
        />
      </div>
    </PairPickerContext.Provider>
  );
}
