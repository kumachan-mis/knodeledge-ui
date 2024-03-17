'use client';
import { Panic } from './openapi';

import React from 'react';

const PanicValueContext = React.createContext<Panic>({ state: 'healthy', message: null });

const PanicSetContext = React.createContext<(message: string) => void>(() => {
  // Do nothing
});

export function usePanicValue(): Panic {
  return React.useContext(PanicValueContext);
}

export function useSetPanic(): (message: string) => void {
  return React.useContext(PanicSetContext);
}

export const PanicContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [panic, setPanic] = React.useState<Panic>({ state: 'healthy', message: null });

  return (
    <PanicValueContext.Provider value={panic}>
      <PanicSetContext.Provider
        value={(message) => {
          setPanic({ state: 'panic', message });
        }}
      >
        {children}
      </PanicSetContext.Provider>
    </PanicValueContext.Provider>
  );
};
