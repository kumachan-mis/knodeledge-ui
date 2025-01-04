import { GraphChildWithId, GraphRootWithId } from '@/contexts/views/graph';

import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

export type GraphEntityLogicProps = {
  readonly graphRoot: GraphRootWithId;
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
  readonly center: { readonly x: number; readonly y: number };
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<GraphChildWithId[]>>;
  readonly setFocusedGraphParentId: React.Dispatch<React.SetStateAction<string>>;
  readonly setFocusedGraphChildId: React.Dispatch<React.SetStateAction<string>>;
};

export type GraphEntityLogicReturn = {
  readonly graphParentNode: GraphNode;
  readonly graphChildrenNodes: GraphNode[];
  readonly graphLinks: GraphLink[];
  readonly focusedLink: GraphLink | undefined;
  readonly inactiveGraphNodes: GraphNode[];
  readonly inactiveGraphLinks: GraphLink[];
  readonly center: { readonly x: number; readonly y: number };
  readonly focusGraphParent: (node: GraphNode) => void;
  readonly focusGraphLink: (link: GraphLink) => void;
  readonly blurGraphParent: () => void;
  readonly blurGraphLink: () => void;
  readonly deleteGraphNode: (node: GraphNode) => void;
  readonly deleteGraphLink: (link: GraphLink) => void;
};

type GraphEntityActiveLogicReturn = Pick<
  GraphEntityLogicReturn,
  'graphParentNode' | 'graphChildrenNodes' | 'graphLinks' | 'focusedLink'
>;

type GraphEntityInactiveLogicReturn = Pick<GraphEntityLogicReturn, 'inactiveGraphNodes' | 'inactiveGraphLinks'>;

type GraphEntityCallbackLogicReturn = Pick<
  GraphEntityLogicReturn,
  'focusGraphParent' | 'focusGraphLink' | 'blurGraphParent' | 'blurGraphLink' | 'deleteGraphNode' | 'deleteGraphLink'
>;

export function graphEntityLogic(props: GraphEntityLogicProps): GraphEntityLogicReturn {
  const activeLogicReturn = graphEntityActiveLogic(props);

  const { graphParentNode } = activeLogicReturn;
  const inactiveLogicReturn = graphEntityInactiveLogic({ ...props, graphParentNode });

  const callbackLogicReturn = graphEntityCallbackLogic(props);

  return { ...activeLogicReturn, ...inactiveLogicReturn, center: props.center, ...callbackLogicReturn };
}

function graphEntityActiveLogic({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  focusedGraphChildId,
}: GraphEntityLogicProps): GraphEntityActiveLogicReturn {
  const focusedGraphParent = graphRootChildren.find((child) => child.id === focusedGraphParentId);
  const graphParent = focusedGraphParent ?? graphRoot;
  const graphChildren = focusedGraphParent?.children ?? graphRootChildren;

  const graphParentNode = new GraphNode(graphParent.id, graphParent.name, true);
  const graphChildrenNodes = graphChildren.map((child) => new GraphNode(child.id, child.name));

  const graphChildrenMap = new Map(graphChildrenNodes.map((node) => [node.name, node]));
  const graphLinks = graphChildren.map((child) => {
    // GraphChildrenMap.get() will never return undefined because the keys are from graphChildrenNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const graphChildNode = graphChildrenMap.get(child.name)!;
    return new GraphLink(graphParentNode, graphChildNode, child.relation, child.description);
  });

  const focusedLink = graphLinks.find((link) => link.target.id === focusedGraphChildId);

  return { graphParentNode, graphChildrenNodes, graphLinks, focusedLink };
}

function graphEntityInactiveLogic({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  graphParentNode,
}: GraphEntityLogicProps & { graphParentNode: GraphNode }): GraphEntityInactiveLogicReturn {
  const focusedGraphParent = graphRootChildren.find((child) => child.id === focusedGraphParentId);
  if (!focusedGraphParent) {
    return { inactiveGraphNodes: [], inactiveGraphLinks: [] };
  }

  const rootNode = new GraphNode(graphRoot.id, graphRoot.name);
  const rootChildenNodes = graphRootChildren.map((child) => {
    if (child.id === graphParentNode.id) return graphParentNode;
    return new GraphNode(child.id, child.name);
  });
  const inactiveGraphNodes = [rootNode, ...rootChildenNodes.filter((node) => node.id !== focusedGraphParentId)];

  const rootChildenNodesMap = new Map(rootChildenNodes.map((node) => [node.name, node]));
  const inactiveGraphLinks = graphRootChildren.map((child) => {
    // RootChildenNodesMap.get() will never return undefined because the keys are from inactiveGraphNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rootChildNode = rootChildenNodesMap.get(child.name)!;
    return new GraphLink(rootNode, rootChildNode, child.relation, child.description);
  });

  return { inactiveGraphNodes, inactiveGraphLinks };
}

function graphEntityCallbackLogic({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  setFocusedGraphParentId,
  setFocusedGraphChildId,
  setFocusedGraphChildren,
}: GraphEntityLogicProps): GraphEntityCallbackLogicReturn {
  const focusGraphParent = (node: GraphNode) => {
    if (graphRoot.id === node.id) {
      setFocusedGraphParentId('');
    } else if (graphRootChildren.some((child) => child.id === node.id)) {
      setFocusedGraphParentId(node.id);
    }
  };

  const focusGraphLink = (link: GraphLink) => {
    if (link.source.id !== focusedGraphParentId) return;
    setFocusedGraphChildId(link.target.id);
  };

  const blurGraphParent = () => {
    setFocusedGraphParentId('');
  };

  const blurGraphLink = () => {
    setFocusedGraphChildId('');
  };

  const deleteGraphNode = (node: GraphNode) => {
    setFocusedGraphChildren((prev) => prev.filter((child) => child.id !== node.id));
  };

  const deleteGraphLink = (link: GraphLink) => {
    setFocusedGraphChildren((prev) => prev.filter((child) => child.id !== link.target.id));
  };

  return { focusGraphParent, focusGraphLink, blurGraphParent, blurGraphLink, deleteGraphNode, deleteGraphLink };
}
