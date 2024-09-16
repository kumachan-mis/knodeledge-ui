'use client';

import { GraphContentWithoutAutofield, PaperWithoutAutofield } from '@/openapi';

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
  readonly initialContent: PaperWithoutAutofield;
  readonly children?: React.ReactNode;
}> = ({ initialContent, children }) => {
  const [paper, setPaper] = React.useState<PaperWithoutAutofield>(initialContent);

  return (
    <PaperContentValueContext.Provider value={paper}>
      <PaperContentSetContext.Provider value={setPaper}>{children}</PaperContentSetContext.Provider>
    </PaperContentValueContext.Provider>
  );
};

const GraphContentValueContext = React.createContext<GraphContentWithoutAutofield>({ paragraph: '' });

const GraphContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<GraphContentWithoutAutofield>>>(
  () => {
    // Do nothing
  },
);

export function useGraphContent(): GraphContentWithoutAutofield {
  return React.useContext(GraphContentValueContext);
}

export function useSetGraphContent(): React.Dispatch<React.SetStateAction<GraphContentWithoutAutofield>> {
  return React.useContext(GraphContentSetContext);
}

export const GraphContentProvider: React.FC<{
  readonly initialContent: GraphContentWithoutAutofield;
  readonly children?: React.ReactNode;
}> = ({ initialContent, children }) => {
  const [graph, setGraph] = React.useState<GraphContentWithoutAutofield>(initialContent);

  return (
    <GraphContentValueContext.Provider value={graph}>
      <GraphContentSetContext.Provider value={setGraph}>{children}</GraphContentSetContext.Provider>
    </GraphContentValueContext.Provider>
  );
};
