import { GraphChild } from '@/openapi';

import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

export type GraphEntityLogicProps = {
  readonly graphRoot: string;
  readonly graphChildren: GraphChild[];
  readonly focusedGraphChildIndex: number;
  readonly center: { readonly x: number; readonly y: number };
  readonly setGraphChildren: React.Dispatch<React.SetStateAction<GraphChild[]>>;
  readonly setFocusedGraphChildIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type GraphEntityLogicReturn = {
  readonly graphParentNode: GraphNode;
  readonly graphChildrenNodes: GraphNode[];
  readonly graphLinks: GraphLink[];
  readonly foccusedLink: GraphLink | null;
  readonly focusGraphLink: (link: GraphLink) => void;
  readonly deleteGraphNode: (node: GraphNode) => void;
  readonly deleteGraphLink: (link: GraphLink) => void;
};

export function graphEntityLogic({
  graphRoot,
  graphChildren,
  focusedGraphChildIndex,
  center,
  setGraphChildren,
  setFocusedGraphChildIndex,
}: GraphEntityLogicProps): GraphEntityLogicReturn {
  const graphParentNode = new GraphNode(graphRoot, center.x, center.y);
  graphParentNode.fix(center.x, center.y);

  const graphChildrenNodes = graphChildren.map((child, index) => {
    const x = center.x + 120 * Math.sin((index / graphChildren.length) * 2 * Math.PI);
    const y = center.y - 120 * Math.cos((index / graphChildren.length) * 2 * Math.PI);
    return new GraphNode(child.name, x, y);
  });
  const graphChildrenMap = new Map(graphChildrenNodes.map((node) => [node.name, node]));

  const graphLinks = graphChildren.map((child) => {
    // GraphChildrenMap.get() will never return undefined because the keys are from graphChildrenNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const graphChildNode = graphChildrenMap.get(child.name)!;
    return new GraphLink(graphParentNode, graphChildNode, child.relation, child.description);
  });

  const foccusedLink =
    0 <= focusedGraphChildIndex && focusedGraphChildIndex < graphLinks.length
      ? graphLinks[focusedGraphChildIndex]
      : null;

  const deleteGraphNode = (node: GraphNode) => {
    setGraphChildren((prev) => prev.filter((child) => child.name !== node.name));
  };

  const deleteGraphLink = (link: GraphLink) => {
    setGraphChildren((prev) => prev.filter((child) => child.name !== link.target.name));
  };

  const focusGraphLink = (link: GraphLink) => {
    const targetIndex = graphChildrenNodes.findIndex((node) => node.name === link.target.name);
    setFocusedGraphChildIndex(targetIndex);
  };

  return {
    graphParentNode,
    graphChildrenNodes,
    graphLinks,
    foccusedLink,
    deleteGraphNode,
    deleteGraphLink,
    focusGraphLink,
  };
}
