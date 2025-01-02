'use client';
import { LoadablePaper } from '../openapi/papers';
import { PaperWithoutAutofield } from '@/openapi';

import React from 'react';

const PaperContentValueContext = React.createContext<PaperWithoutAutofield>({ content: '' });

const PaperContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<PaperWithoutAutofield>>>(() => {
  // Do nothing
});

export function usePaperContent(): PaperWithoutAutofield {
  return React.useContext(PaperContentValueContext);
}

export function useSetPaperContent(): React.Dispatch<React.SetStateAction<PaperWithoutAutofield>> {
  return React.useContext(PaperContentSetContext);
}

export const PaperContentProvider: React.FC<{
  readonly loadablePaper: LoadablePaper;
  readonly children?: React.ReactNode;
}> = ({ loadablePaper, children }) => {
  if (loadablePaper.state !== 'success') {
    return children;
  }
  return <PaperContentInnerProvider initialPaper={loadablePaper.data}>{children}</PaperContentInnerProvider>;
};

const PaperContentInnerProvider: React.FC<{
  readonly initialPaper: PaperWithoutAutofield;
  readonly children?: React.ReactNode;
}> = ({ initialPaper, children }) => {
  const [paper, setPaper] = React.useState<PaperWithoutAutofield>(initialPaper);

  return (
    <PaperContentValueContext.Provider value={paper}>
      <PaperContentSetContext.Provider value={setPaper}>{children}</PaperContentSetContext.Provider>
    </PaperContentValueContext.Provider>
  );
};
