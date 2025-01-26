'use client';
import { LoadableGraph } from '../openapi/graphs';
import { GraphChild, GraphContentWithoutAutofield } from '@/openapi';

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
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
};

const GraphContentRootValueContext = React.createContext<GraphRootWithId>({
  id: '',
  name: '',
});

const GraphContentValueContext = React.createContext<GraphContent>({
  paragraph: '',
  graphRootChildren: [],
  focusedGraphParentId: '',
  focusedGraphChildId: '',
});
const GraphContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<GraphContent>>>(() => {
  // Do nothing
});

export function useGraphContentRoot(): GraphRootWithId {
  return React.useContext(GraphContentRootValueContext);
}

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
  const { id: focusedGraphParentId, name, paragraph, children: graphChildren } = loadableGraph.data;
  const graphRootChildren = graphChildren.map(issueGraphChildId);
  const initialContent: GraphContent = { paragraph, graphRootChildren, focusedGraphParentId, focusedGraphChildId: '' };
  return (
    <GraphContentInnerProvider id={focusedGraphParentId} initialContent={initialContent} rootName={name}>
      {children}
    </GraphContentInnerProvider>
  );
};
const GraphContentInnerProvider: React.FC<{
  readonly id: string;
  readonly rootName: string;
  readonly initialContent: GraphContent;
  readonly children?: React.ReactNode;
}> = ({ id, rootName, initialContent, children }) => {
  const rootContent: GraphRootWithId = React.useMemo(() => ({ id, name: rootName }), [id, rootName]);
  const [graph, setGraph] = React.useState<GraphContent>(initialContent);

  return (
    <GraphContentRootValueContext.Provider value={rootContent}>
      <GraphContentValueContext.Provider value={graph}>
        <GraphContentSetContext.Provider value={setGraph}>{children}</GraphContentSetContext.Provider>
      </GraphContentValueContext.Provider>
    </GraphContentRootValueContext.Provider>
  );
};

export function graphContentToServer(client: GraphContent): GraphContentWithoutAutofield {
  return { paragraph: client.paragraph, children: client.graphRootChildren.map(graphChildToServer) };
}

function graphChildToServer(client: GraphChildWithId): GraphChild {
  return {
    name: client.name,
    relation: client.relation,
    description: client.description,
    children: client.children.map(graphChildToServer),
  };
}

export function graphContentEquals(client: GraphContent, server: GraphContentWithoutAutofield): boolean {
  return server.paragraph === client.paragraph && graphChildrenEquals(client.graphRootChildren, server.children);
}

function graphChildrenEquals(client: GraphChildWithId[], server: GraphChild[]): boolean {
  if (server.length !== client.length) {
    return false;
  }
  for (let i = 0; i < server.length; i++) {
    if (!graphChildEquals(client[i], server[i])) {
      return false;
    }
  }
  return true;
}

function graphChildEquals(client: GraphChildWithId, server: GraphChild): boolean {
  return (
    client.name === server.name &&
    client.relation === server.relation &&
    client.description === server.description &&
    graphChildrenEquals(client.children, server.children)
  );
}

function issueGraphChildId(child: GraphChild): GraphChildWithId {
  return { ...child, id: generateGraphChildId(), children: child.children.map(issueGraphChildId) };
}

export function generateGraphChildId(): string {
  return Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(16);
}
