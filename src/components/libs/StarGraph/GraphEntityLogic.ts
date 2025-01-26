import GraphChildWithId from './GraphChildWithId';
import GraphLink from './GraphLink';
import GraphMenuItem from './GraphMenuItem';
import GraphNode from './GraphNode';
import GraphRootWithId from './GraphRootWithId';

export type GraphEntityLogicProps = {
  readonly graphRoot: GraphRootWithId;
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParent: GraphRootWithId;
  readonly focusedGraphChildren: GraphChildWithId[];
  readonly focusedGraphChild: GraphChildWithId | null;
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
  readonly graphNodeNenuItems: GraphMenuItem<GraphNode>[];
  readonly graphLinkMenuItems: GraphMenuItem<GraphLink>[];
  readonly reorderGraphChildren: (key: (node: GraphNode) => number) => void;
  readonly focusGraphLink: (link: GraphLink) => void;
  readonly blurGraphLink: () => void;
};

export function graphEntityLogic(props: GraphEntityLogicProps): GraphEntityLogicReturn {
  const activeLogicReturn = graphEntityActiveLogic(props);

  const { graphParentNode, graphChildrenNodes } = activeLogicReturn;
  const inactiveLogicReturn = graphEntityInactiveLogic({ ...props, graphParentNode });

  const callbackLogicReturn = graphEntityCallbackLogic({ ...props, graphChildrenNodes });

  return { ...activeLogicReturn, ...inactiveLogicReturn, center: props.center, ...callbackLogicReturn };
}

type GraphEntityActiveLogicProps = GraphEntityLogicProps;

type GraphEntityActiveLogicReturn = Pick<
  GraphEntityLogicReturn,
  'graphParentNode' | 'graphChildrenNodes' | 'graphLinks' | 'focusedLink'
>;

function graphEntityActiveLogic({
  focusedGraphParent,
  focusedGraphChildren,
  focusedGraphChild,
}: GraphEntityActiveLogicProps): GraphEntityActiveLogicReturn {
  const graphParentNode = new GraphNode(focusedGraphParent.id, focusedGraphParent.name);
  const graphChildrenNodes = focusedGraphChildren.map((child) => new GraphNode(child.id, child.name));

  const graphChildrenMap = new Map(graphChildrenNodes.map((node) => [node.id, node]));
  const graphLinks = focusedGraphChildren.map((child) => {
    // GraphChildrenMap.get() will never return undefined because the keys are from graphChildrenNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const graphChildNode = graphChildrenMap.get(child.id)!;
    return new GraphLink(graphParentNode, graphChildNode, child.relation, child.description);
  });

  const focusedLink = graphLinks.find((link) => link.target.id === focusedGraphChild?.id);

  return { graphParentNode, graphChildrenNodes, graphLinks, focusedLink };
}

type GraphEntityInactiveLogicProps = GraphEntityLogicProps & { graphParentNode: GraphNode };

type GraphEntityInactiveLogicReturn = Pick<GraphEntityLogicReturn, 'inactiveGraphNodes' | 'inactiveGraphLinks'>;

function graphEntityInactiveLogic({
  graphRoot,
  graphRootChildren,
  focusedGraphParent,
  graphParentNode,
}: GraphEntityInactiveLogicProps): GraphEntityInactiveLogicReturn {
  if (focusedGraphParent.id === graphRoot.id) {
    return { inactiveGraphNodes: [], inactiveGraphLinks: [] };
  }

  const rootNode = new GraphNode(graphRoot.id, graphRoot.name);
  const rootChildenNodes = graphRootChildren.map((child) => {
    if (child.id === graphParentNode.id) return graphParentNode;
    return new GraphNode(child.id, child.name);
  });
  const inactiveGraphNodes = [rootNode, ...rootChildenNodes.filter((node) => node.id !== focusedGraphParent.id)];

  const rootChildenNodesMap = new Map(rootChildenNodes.map((node) => [node.id, node]));
  const inactiveGraphLinks = graphRootChildren.map((child) => {
    // RootChildenNodesMap.get() will never return undefined because the keys are from inactiveGraphNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rootChildNode = rootChildenNodesMap.get(child.id)!;
    return new GraphLink(rootNode, rootChildNode, child.relation, child.description);
  });

  return { inactiveGraphNodes, inactiveGraphLinks };
}

type GraphEntityCallbackLogicProps = GraphEntityLogicProps & { graphChildrenNodes: GraphNode[] };

type GraphEntityCallbackLogicReturn = Pick<
  GraphEntityLogicReturn,
  'graphNodeNenuItems' | 'graphLinkMenuItems' | 'reorderGraphChildren' | 'focusGraphLink' | 'blurGraphLink'
>;

function graphEntityCallbackLogic({
  graphRoot,
  graphRootChildren,
  focusedGraphParent,
  setFocusedGraphParentId,
  setFocusedGraphChildId,
  setFocusedGraphChildren,
  graphChildrenNodes,
}: GraphEntityCallbackLogicProps): GraphEntityCallbackLogicReturn {
  const graphNodeNenuItems: GraphMenuItem<GraphNode>[] = [
    {
      name: 'Expand',
      onClick: (event, node) => {
        setFocusedGraphParentId(node.id);
      },
      disabled: (node) =>
        node.id === focusedGraphParent.id ||
        (node.id !== graphRoot.id && graphRootChildren.every((child) => child.id !== node.id)),
    },
    {
      name: 'Collapse',
      onClick: () => {
        setFocusedGraphParentId(graphRoot.id);
      },
      disabled: (node) => node.id !== focusedGraphParent.id || node.id === graphRoot.id,
    },
    {
      name: 'Delete',
      onClick: (event, node) => {
        setFocusedGraphChildren((prev) => prev.filter((child) => child.id !== node.id));
      },
      disabled: (node) => graphChildrenNodes.every((child) => child.id !== node.id),
    },
  ];

  const graphLinkMenuItems: GraphMenuItem<GraphLink>[] = [
    {
      name: 'Delete',
      onClick: (event, link) => {
        setFocusedGraphChildren((prev) => prev.filter((child) => child.id !== link.target.id));
      },
      disabled: (link) => graphChildrenNodes.every((child) => child.id !== link.target.id),
    },
  ];

  const graphChildrenNodesMap = new Map(graphChildrenNodes.map((node) => [node.id, node]));
  const reorderGraphChildren = (key: (node: GraphNode) => number) => {
    setFocusedGraphChildren((prev) => {
      // GraphChildrenNodesMap.get() will never return undefined because the keys are from focusedGraphChildren
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [...prev].sort((a, b) => key(graphChildrenNodesMap.get(a.id)!) - key(graphChildrenNodesMap.get(b.id)!));
    });
  };

  const focusGraphLink = (link: GraphLink) => {
    if (link.source.id !== focusedGraphParent.id) return;
    setFocusedGraphChildId(link.target.id);
  };

  const blurGraphLink = () => {
    setFocusedGraphChildId('');
  };

  return { graphNodeNenuItems, graphLinkMenuItems, reorderGraphChildren, focusGraphLink, blurGraphLink };
}
