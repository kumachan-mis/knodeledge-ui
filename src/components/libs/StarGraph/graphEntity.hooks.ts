import GraphLink from './GraphLink';
import GraphMenuItem from './GraphMenuItem';
import GraphNode from './GraphNode';
import { StarGraphChildWithId, StarGraphRootWithId } from './context';
import { useFocusedGraphChild } from './focusedGraphChild.hooks';
import { useFocusedGraph } from './focusedGraph.hooks';

import { StarGraphProps } from '.';

import React from 'react';

export type GraphEntityReturn = {
  readonly graphParentNode: GraphNode;
  readonly graphChildrenNodes: GraphNode[];
  readonly graphLinks: GraphLink[];
  readonly focusedLink: GraphLink | undefined;
  readonly inactiveGraphNodes: GraphNode[];
  readonly inactiveGraphLinks: GraphLink[];
  readonly graphNodeNenuItems: GraphMenuItem<GraphNode>[];
  readonly graphLinkMenuItems: GraphMenuItem<GraphLink>[];
  readonly reorderGraphChildren: (key: (node: GraphNode) => number) => void;
  readonly focusGraphRoot: () => void;
  readonly focusGraphLink: (link: GraphLink) => void;
  readonly blurGraphLink: () => void;
};

export function useGraphEntity(props: StarGraphProps): GraphEntityReturn {
  const { focusedGraphChildId, graphRoot, graphRootChildren, setFocusedGraphParentId, setFocusedGraphChildId } = props;

  const focusedGraph = useFocusedGraph(props);
  const { focusedGraphParent, focusedGraphChildren, setFocusedGraphChildren } = focusedGraph;

  const focusedChild = useFocusedGraphChild({ ...focusedGraph, focusedGraphChildId });
  const { focusedGraphChild } = focusedChild;

  const activeGraphEntity = useActiveGraphEntity({ focusedGraphParent, focusedGraphChildren, focusedGraphChild });
  const { graphParentNode, graphChildrenNodes } = activeGraphEntity;

  const inactiveGraphEntity = useInactiveGraphEntity({
    graphRoot,
    graphRootChildren,
    focusedGraphParent,
    graphParentNode,
  });

  const graphEntityCallback = useGraphEntityCallback({
    graphRoot,
    graphRootChildren,
    focusedGraphParent,
    setFocusedGraphChildren,
    setFocusedGraphParentId,
    setFocusedGraphChildId,
    graphChildrenNodes,
  });

  const graphEntity = React.useMemo(
    () => ({ ...activeGraphEntity, ...inactiveGraphEntity, ...graphEntityCallback }),
    [activeGraphEntity, inactiveGraphEntity, graphEntityCallback],
  );

  return graphEntity;
}

type ActiveGraphEntityProps = {
  readonly focusedGraphParent: StarGraphRootWithId;
  readonly focusedGraphChildren: StarGraphChildWithId[];
  readonly focusedGraphChild: StarGraphChildWithId | null;
};

type ActiveGraphEntityReturn = Pick<
  GraphEntityReturn,
  'graphParentNode' | 'graphChildrenNodes' | 'graphLinks' | 'focusedLink'
>;

function useActiveGraphEntity({
  focusedGraphParent,
  focusedGraphChildren,
  focusedGraphChild,
}: ActiveGraphEntityProps): ActiveGraphEntityReturn {
  const graphParentNode = React.useMemo(
    () => new GraphNode(focusedGraphParent.id, focusedGraphParent.name),
    [focusedGraphParent],
  );

  const graphChildrenNodes = React.useMemo(
    () => focusedGraphChildren.map((child) => new GraphNode(child.id, child.name)),
    [focusedGraphChildren],
  );

  const graphLinks = React.useMemo(() => {
    const graphChildrenMap = new Map(graphChildrenNodes.map((node) => [node.id, node]));
    return focusedGraphChildren.map((child) => {
      // GraphChildrenMap.get() will never return undefined because the keys are from graphChildrenNodes
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const graphChildNode = graphChildrenMap.get(child.id)!;
      return new GraphLink(graphParentNode, graphChildNode, child.relation, child.description);
    });
  }, [graphChildrenNodes, graphParentNode, focusedGraphChildren]);

  const focusedLink = graphLinks.find((link) => link.target.id === focusedGraphChild?.id);

  return { graphParentNode, graphChildrenNodes, graphLinks, focusedLink };
}

type InactiveGraphEntityProps = {
  readonly graphRoot: StarGraphRootWithId;
  readonly graphRootChildren: StarGraphChildWithId[];
  readonly focusedGraphParent: StarGraphRootWithId;
  readonly graphParentNode: GraphNode;
};

type InactiveGraphEntityReturn = Pick<GraphEntityReturn, 'inactiveGraphNodes' | 'inactiveGraphLinks'>;

function useInactiveGraphEntity({
  graphRoot,
  graphRootChildren,
  focusedGraphParent,
  graphParentNode,
}: InactiveGraphEntityProps): InactiveGraphEntityReturn {
  const rootNode = React.useMemo(() => new GraphNode(graphRoot.id, graphRoot.name), [graphRoot]);
  const rootChildenNodes = React.useMemo(
    () =>
      graphRootChildren.map((child) => {
        if (child.id === graphParentNode.id) return graphParentNode;
        return new GraphNode(child.id, child.name);
      }),
    [graphRootChildren, graphParentNode],
  );

  const inactiveGraphNodes = React.useMemo(() => {
    if (focusedGraphParent.id === graphRoot.id) return [];
    return [rootNode, ...rootChildenNodes.filter((node) => node.id !== focusedGraphParent.id)];
  }, [focusedGraphParent.id, graphRoot.id, rootNode, rootChildenNodes]);

  const inactiveGraphLinks = React.useMemo(() => {
    if (focusedGraphParent.id === graphRoot.id) return [];
    const rootChildenNodesMap = new Map(rootChildenNodes.map((node) => [node.id, node]));
    return graphRootChildren.map((child) => {
      // RootChildenNodesMap.get() will never return undefined because the keys are from inactiveGraphNodes
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rootChildNode = rootChildenNodesMap.get(child.id)!;
      return new GraphLink(rootNode, rootChildNode, child.relation, child.description);
    });
  }, [focusedGraphParent.id, graphRoot.id, rootChildenNodes, graphRootChildren, rootNode]);

  return { inactiveGraphNodes, inactiveGraphLinks };
}

type GraphEntityCallbackProps = {
  readonly graphRoot: StarGraphRootWithId;
  readonly graphRootChildren: StarGraphChildWithId[];
  readonly focusedGraphParent: StarGraphRootWithId;
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<StarGraphChildWithId[]>>;
  readonly setFocusedGraphParentId: React.Dispatch<React.SetStateAction<string>>;
  readonly setFocusedGraphChildId: React.Dispatch<React.SetStateAction<string>>;
  readonly graphChildrenNodes: GraphNode[];
};

type GraphEntityCallbackReturn = Pick<
  GraphEntityReturn,
  | 'graphNodeNenuItems'
  | 'graphLinkMenuItems'
  | 'reorderGraphChildren'
  | 'focusGraphRoot'
  | 'focusGraphLink'
  | 'blurGraphLink'
>;

function useGraphEntityCallback({
  graphRoot,
  graphRootChildren,
  focusedGraphParent,
  setFocusedGraphParentId,
  setFocusedGraphChildId,
  setFocusedGraphChildren,
  graphChildrenNodes,
}: GraphEntityCallbackProps): GraphEntityCallbackReturn {
  const graphNodeNenuItems: GraphMenuItem<GraphNode>[] = React.useMemo(
    () => [
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
    ],
    [
      focusedGraphParent,
      graphRoot,
      graphRootChildren,
      setFocusedGraphParentId,
      setFocusedGraphChildren,
      graphChildrenNodes,
    ],
  );

  const graphLinkMenuItems: GraphMenuItem<GraphLink>[] = React.useMemo(
    () => [
      {
        name: 'Delete',
        onClick: (event, link) => {
          setFocusedGraphChildren((prev) => prev.filter((child) => child.id !== link.target.id));
        },
        disabled: (link) => graphChildrenNodes.every((child) => child.id !== link.target.id),
      },
    ],
    [graphChildrenNodes, setFocusedGraphChildren],
  );

  const graphChildrenNodesMap = React.useMemo(
    () => new Map(graphChildrenNodes.map((node) => [node.id, node])),
    [graphChildrenNodes],
  );
  const reorderGraphChildren = React.useCallback(
    (key: (node: GraphNode) => number) => {
      setFocusedGraphChildren((prev) => {
        // GraphChildrenNodesMap.get() will never return undefined because the keys are from focusedGraphChildren
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [...prev].sort((a, b) => key(graphChildrenNodesMap.get(a.id)!) - key(graphChildrenNodesMap.get(b.id)!));
      });
    },
    [graphChildrenNodesMap, setFocusedGraphChildren],
  );

  const focusGraphRoot = React.useCallback(() => {
    setFocusedGraphParentId(graphRoot.id);
  }, [graphRoot.id, setFocusedGraphParentId]);

  const focusGraphLink = React.useCallback(
    (link: GraphLink) => {
      if (link.source.id !== focusedGraphParent.id) return;
      setFocusedGraphChildId(link.target.id);
    },
    [focusedGraphParent.id, setFocusedGraphChildId],
  );

  const blurGraphLink = React.useCallback(() => {
    setFocusedGraphChildId('');
  }, [setFocusedGraphChildId]);

  return {
    graphNodeNenuItems,
    graphLinkMenuItems,
    reorderGraphChildren,
    focusGraphRoot,
    focusGraphLink,
    blurGraphLink,
  };
}
