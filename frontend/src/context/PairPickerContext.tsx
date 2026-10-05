'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PersonNode } from '../components/MatchmakingField';

interface PairPickerContextType {
  isOpen: boolean;
  agentA: PersonNode | null;
  agentB: PersonNode | null;
  openPairPicker: (agentA?: PersonNode | null, agentB?: PersonNode | null) => void;
  closePairPicker: () => void;
}

const PairPickerContext = createContext<PairPickerContextType>({
  isOpen: false,
  agentA: null,
  agentB: null,
  openPairPicker: () => {},
  closePairPicker: () => {}
});

export function PairPickerProvider({
  children,
  allPeople
}: {
  children: React.ReactNode;
  allPeople: PersonNode[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [agentA, setAgentA] = useState<PersonNode | null>(null);
  const [agentB, setAgentB] = useState<PersonNode | null>(null);

  const openPairPicker = useCallback((a?: PersonNode | null, b?: PersonNode | null) => {
    if (a) setAgentA(a);
    if (b) setAgentB(b);
    setIsOpen(true);
  }, []);

  const closePairPicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <PairPickerContext.Provider
      value={{
        isOpen,
        agentA,
        agentB,
        openPairPicker,
        closePairPicker
      }}
    >
      {children}
    </PairPickerContext.Provider>
  );
}

export function usePairPicker() {
  return useContext(PairPickerContext);
}
