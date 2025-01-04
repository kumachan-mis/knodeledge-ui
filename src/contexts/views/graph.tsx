'use client';
import { LoadableGraph } from '../openapi/graphs';
import { GraphChild } from '@/openapi';

import React from 'react';

export type GraphRootWithId = {
  readonly id: string;
  readonly name: string;
};

export type GraphChildWithId = Omit<GraphChild, 'children'> & {
  readonly id: string;
  readonly children: GraphChildWithId[];
};

export type GraphContent = {
  readonly paragraph: string;
  readonly children: GraphChildWithId[];
  readonly focusedChildIndex: number;
};

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

export function issueGraphChildId(child: GraphChild): GraphChildWithId {
  const randomId = Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(16);
  return { ...child, id: randomId, children: child.children.map(issueGraphChildId) };
}

export const GraphContentProvider: React.FC<{
  readonly loadableGraph: LoadableGraph;
  readonly children?: React.ReactNode;
}> = ({ loadableGraph, children }) => {
  if (loadableGraph.state !== 'success') {
    return children;
  }
  const { paragraph, children: graphChildren } = loadableGraph.data;
  const graphChildrenWithId = graphChildren.map(issueGraphChildId);
  return (
    <GraphContentInnerProvider initialContent={{ paragraph, children: graphChildrenWithId, focusedChildIndex: -1 }}>
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
