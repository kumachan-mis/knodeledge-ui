'use client';
import { LoadableGraph } from '../openapi/graphs';
import { StarGraphChild, StarGraphContentProvider, useStarGraphContent } from '@/components/libs/StarGraph/context';
import { Graph, GraphChild, GraphContentWithoutAutofield } from '@/openapi';

import React from 'react';

export type GraphParagraph = {
  readonly paragraph: string;
};

export type GraphContent = GraphParagraph & {
  readonly children: StarGraphChild[];
};

const GraphParagraphValueContext = React.createContext<GraphParagraph>({
  paragraph: '',
});
const GraphParagraphSetContext = React.createContext<React.Dispatch<React.SetStateAction<GraphParagraph>>>(() => {
  // Do nothing
});

export function useGraphContent(): GraphContent {
  const paragraph = useGraphParagraph();
  const graph = useStarGraphContent();
  return { paragraph: paragraph.paragraph, children: graph.graphRootChildren };
}

export function useGraphParagraph(): GraphParagraph {
  return React.useContext(GraphParagraphValueContext);
}

export function useSetGraphParagraph(): React.Dispatch<React.SetStateAction<GraphParagraph>> {
  return React.useContext(GraphParagraphSetContext);
}

export const GraphContentProvider: React.FC<{
  readonly loadableGraph: LoadableGraph;
  readonly children?: React.ReactNode;
}> = ({ loadableGraph, children }) => {
  if (loadableGraph.state !== 'success') {
    return children;
  }
  return <GraphContentInnerProvider initialGraph={loadableGraph.data}>{children}</GraphContentInnerProvider>;
};
const GraphContentInnerProvider: React.FC<{
  readonly initialGraph: Graph;
  readonly children?: React.ReactNode;
}> = ({ initialGraph, children }) => {
  const graphRoot = React.useMemo(() => ({ name: initialGraph.name }), [initialGraph.name]);
  const [paragraph, setParagraph] = React.useState<GraphParagraph>({ paragraph: initialGraph.paragraph });

  return (
    <StarGraphContentProvider graphRoot={graphRoot} graphRootChildren={initialGraph.children}>
      <GraphParagraphValueContext.Provider value={paragraph}>
        <GraphParagraphSetContext.Provider value={setParagraph}>{children}</GraphParagraphSetContext.Provider>
      </GraphParagraphValueContext.Provider>
    </StarGraphContentProvider>
  );
};

export function graphContentToServer(client: GraphContent): GraphContentWithoutAutofield {
  return {
    paragraph: client.paragraph,
    children: graphChildrenToServer(client.children),
  };
}

export function graphChildrenToServer(client: StarGraphChild[]): GraphChild[] {
  return client.map(graphChildToServer);
}

function graphChildToServer(client: StarGraphChild): GraphChild {
  return {
    name: client.name,
    relation: client.relation,
    description: client.description,
    children: client.children.map(graphChildToServer),
  };
}

export function graphContentEquals(client: GraphContent, server: GraphContentWithoutAutofield): boolean {
  return client.paragraph === server.paragraph && graphChildrenEquals(client.children, server.children);
}

function graphChildrenEquals(client: StarGraphChild[], server: GraphChild[]): boolean {
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

function graphChildEquals(client: StarGraphChild, server: GraphChild): boolean {
  return (
    client.name === server.name &&
    client.relation === server.relation &&
    client.description === server.description &&
    graphChildrenEquals(client.children, server.children)
  );
}
