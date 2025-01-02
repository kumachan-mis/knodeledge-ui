'use client';
import { LoadableGraph } from '../openapi/graphs';
import { GraphContentWithoutAutofield } from '@/openapi';

import React from 'react';

const GraphContentValueContext = React.createContext<GraphContentWithoutAutofield>({ paragraph: '', children: [] });
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
  readonly loadableGraph: LoadableGraph;
  readonly children?: React.ReactNode;
}> = ({ loadableGraph, children }) => {
  if (loadableGraph.state !== 'success') {
    return children;
  }
  return <GraphContentInnerProvider initialContent={loadableGraph.data}>{children}</GraphContentInnerProvider>;
};
const GraphContentInnerProvider: React.FC<{
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
