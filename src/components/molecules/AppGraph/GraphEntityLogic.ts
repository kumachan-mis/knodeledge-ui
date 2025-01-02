import { GraphChild } from '@/openapi';

import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

export type GraphEntityLogicProps = {
  readonly graphRoot: string;
  readonly graphChildren: GraphChild[];
  readonly center: { readonly x: number; readonly y: number };
};

export type GraphEntityLogicReturn = {
  readonly graphParentNode: GraphNode;
  readonly graphChildrenNodes: GraphNode[];
  readonly graphLinks: GraphLink[];
};

export function graphEntityLogic({ graphRoot, graphChildren, center }: GraphEntityLogicProps): GraphEntityLogicReturn {
  const graphParentNode = new GraphNode(graphRoot, center.x, center.y);
  graphParentNode.fix(center.x, center.y);

  const graphChildrenNodes = graphChildren.map((child, index) => {
    const x = center.x + 100 * Math.sin((index / graphChildren.length) * 2 * Math.PI);
    const y = center.y - 100 * Math.cos((index / graphChildren.length) * 2 * Math.PI);
    return new GraphNode(child.name, x, y);
  });
  const graphChildrenMap = new Map(graphChildrenNodes.map((node) => [node.name, node]));

  const graphLinks = graphChildren.map((child) => {
    // GraphChildrenMap.get() will never return undefined because the keys are from graphChildrenNodes
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const graphChildNode = graphChildrenMap.get(child.name)!;
    return new GraphLink(graphParentNode, graphChildNode, child.relation, child.description);
  });

  return { graphParentNode, graphChildrenNodes, graphLinks };
}
