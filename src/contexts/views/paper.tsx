'use client';
import { LoadablePaper } from '../openapi/papers';
import { PaperWithoutAutofield } from '@/openapi';

import React from 'react';

export type PaperContent = {
  readonly content: string;
};

const PaperContentValueContext = React.createContext<PaperContent>({ content: '' });

const PaperContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<PaperContent>>>(() => {
  // Do nothing
});

export function usePaperContent(): PaperContent {
  return React.useContext(PaperContentValueContext);
}

export function useSetPaperContent(): React.Dispatch<React.SetStateAction<PaperContent>> {
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
  readonly initialPaper: PaperContent;
  readonly children?: React.ReactNode;
}> = ({ initialPaper, children }) => {
  const [paper, setPaper] = React.useState<PaperContent>(initialPaper);

  return (
    <PaperContentValueContext.Provider value={paper}>
      <PaperContentSetContext.Provider value={setPaper}>{children}</PaperContentSetContext.Provider>
    </PaperContentValueContext.Provider>
  );
};

export function paperContentToServer(client: PaperContent): PaperWithoutAutofield {
  return { content: client.content };
}

export function paperContentEquals(client: PaperContent, server: PaperWithoutAutofield): boolean {
  return client.content === server.content;
}
