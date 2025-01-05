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
  readonly rootChildren: GraphChildWithId[];
  readonly focusedParentId: string;
  readonly focusedChildId: string;
};

const GraphContentRootValueContext = React.createContext<GraphRootWithId>({
  id: '',
  name: '',
});

const GraphContentValueContext = React.createContext<GraphContent>({
  paragraph: '',
  rootChildren: [],
  focusedParentId: '',
  focusedChildId: '',
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
  const { id, name, paragraph, children: grapRoothChildren } = loadableGraph.data;
  const grapRoothChildrenWithId = grapRoothChildren.map(issueGraphChildId);
  return (
    <GraphContentInnerProvider
      initialContent={{ paragraph, rootChildren: grapRoothChildrenWithId, focusedParentId: id, focusedChildId: '' }}
      rootContent={{ id, name }}
    >
      {children}
    </GraphContentInnerProvider>
  );
};
const GraphContentInnerProvider: React.FC<{
  readonly rootContent: GraphRootWithId;
  readonly initialContent: GraphContent;
  readonly children?: React.ReactNode;
}> = ({ rootContent, initialContent, children }) => {
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
  return { paragraph: client.paragraph, children: client.rootChildren.map(graphChildToServer) };
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
  return server.paragraph === client.paragraph && graphChildrenEquals(client.rootChildren, server.children);
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
