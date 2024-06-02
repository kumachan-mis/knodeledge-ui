'use client';

import React from 'react';

const PaperContentValueContext = React.createContext<string>('');

const PaperContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<string>>>(() => {
  // Do nothing
});

export function usePaperContent(): string {
  return React.useContext(PaperContentValueContext);
}

export function useSetPaperContent(): React.Dispatch<React.SetStateAction<string>> {
  return React.useContext(PaperContentSetContext);
}

export const PaperContentProvider: React.FC<{
  readonly initialContent: string;
  readonly children?: React.ReactNode;
}> = ({ initialContent, children }) => {
  const [paper, setPaper] = React.useState<string>(initialContent);

  return (
    <PaperContentValueContext.Provider value={paper}>
      <PaperContentSetContext.Provider value={setPaper}>{children}</PaperContentSetContext.Provider>
    </PaperContentValueContext.Provider>
  );
};
