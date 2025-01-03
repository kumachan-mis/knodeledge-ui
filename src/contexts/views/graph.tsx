'use client';
import { LoadableGraph } from '../openapi/graphs';
import { GraphContentWithoutAutofield } from '@/openapi';

import React from 'react';

type GraphContent = GraphContentWithoutAutofield & { readonly focusedChildIndex: number };

const GraphContentValueContext = React.createContext<GraphContent>({
  paragraph: '',
  children: [],
  focusedChildIndex: -1,
});
const GraphContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<GraphContent>>>(() => {
  // Do nothing
});

export function useGraphContent(): GraphContent {
  return React.useContext(GraphContentValueContext);
}

export function useSetGraphContent(): React.Dispatch<React.SetStateAction<GraphContent>> {
  return React.useContext(GraphContentSetContext);
}

export const GraphContentProvider: React.FC<{
  readonly loadableGraph: LoadableGraph;
  readonly children?: React.ReactNode;
}> = ({ loadableGraph, children }) => {
  if (loadableGraph.state !== 'success') {
    return children;
  }
  return (
    <GraphContentInnerProvider initialContent={{ ...loadableGraph.data, focusedChildIndex: -1 }}>
      {children}
    </GraphContentInnerProvider>
  );
};
const GraphContentInnerProvider: React.FC<{
  readonly initialContent: GraphContent;
  readonly children?: React.ReactNode;
}> = ({ initialContent, children }) => {
  const [graph, setGraph] = React.useState<GraphContent>(initialContent);

  return (
    <GraphContentValueContext.Provider value={graph}>
      <GraphContentSetContext.Provider value={setGraph}>{children}</GraphContentSetContext.Provider>
    </GraphContentValueContext.Provider>
  );
};
