import { GraphChildWithId, GraphRootWithId } from '@/contexts/views/graph';

import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

export type GraphEntityLogicProps = {
  readonly graphRoot: GraphRootWithId;
  readonly graphChildren: GraphChildWithId[];
  readonly focusedGraphChildIndex: number;
  readonly center: { readonly x: number; readonly y: number };
  readonly setGraphChildren: React.Dispatch<React.SetStateAction<GraphChildWithId[]>>;
  readonly setFocusedGraphChildIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type GraphEntityLogicReturn = {
  readonly graphParentNode: GraphNode;
  readonly graphChildrenNodes: GraphNode[];
  readonly graphLinks: GraphLink[];
  readonly foccusedLink: GraphLink | null;
  readonly center: { readonly x: number; readonly y: number };
  readonly focusGraphLink: (link: GraphLink) => void;
  readonly blurGraphLink: () => void;
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
  const graphParentNode = new GraphNode(graphRoot.id, graphRoot.name);
  const graphChildrenNodes = graphChildren.map((child) => new GraphNode(child.id, child.name));
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

  const blurGraphLink = () => {
    setFocusedGraphChildIndex(-1);
  };

  return {
    graphParentNode,
    graphChildrenNodes,
    graphLinks,
    foccusedLink,
    center,
    focusGraphLink,
    blurGraphLink,
    deleteGraphNode,
    deleteGraphLink,
  };
}
