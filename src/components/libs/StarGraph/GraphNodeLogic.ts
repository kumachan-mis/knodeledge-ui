import { GraphEntityLogicReturn } from './GraphEntityLogic';
import GraphMenuLogic from './GraphMenuLogic';
import GraphNode from './GraphNode';
import GraphSimulationLogic from './GraphSimulationLogic';
import styles from './styles.module.scss';

import { drag } from 'd3-drag';
import { Selection } from 'd3-selection';

class GraphNodeLogic {
  private nodeRootSelection: Selection<SVGGElement, unknown, null, undefined> | null = null;
  private nodeSelection: Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null = null;

  public constructor(
    private readonly menuLogic: GraphMenuLogic,
    private readonly simulationLogic: GraphSimulationLogic,
  ) {}

  public initNode(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.nodeRootSelection = svgSelection.append('g');
    this.nodeSelection = this.nodeRootSelection.selectAll<SVGGElement, GraphNode>('g');
  }

  public onTick(): void {
    if (!this.nodeSelection) return;

    this.nodeSelection
      .select<SVGCircleElement>('circle')
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);

    this.nodeSelection
      .select<SVGRectElement>('rect')
      .attr('transform', (node) => `translate(${node.x},${node.y + 20})`);

    this.nodeSelection
      .select<SVGTextElement>('text')
      .attr('transform', (node) => `translate(${node.x},${node.y + 20})`);
  }

  public update({
    graphParentNode,
    graphChildrenNodes,
    inactiveGraphNodes,
    graphNodeNenuItems,
    reorderGraphChildren,
    center,
  }: GraphEntityLogicReturn): void {
    if (!this.nodeSelection) return;

    graphParentNode.fix(center.x, center.y);

    const oldGraphNodeMap = new Map(this.nodeSelection.data().map((node) => [node.id, node]));
    const graphNodes = [...inactiveGraphNodes, ...graphChildrenNodes, graphParentNode];
    if (graphNodes.length === oldGraphNodeMap.size && graphNodes.every((node) => oldGraphNodeMap.has(node.id))) {
      // GraphNodesMap.get() will never return undefined because the if condition above checks for that.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const parenOldNode = oldGraphNodeMap.get(graphParentNode.id)!;
      const [parentDx, parentDy] = [center.x - parenOldNode.x, center.y - parenOldNode.y];

      graphChildrenNodes.forEach((childNode) => {
        // GraphNodesMap.get() will never return undefined because the if condition above checks for that.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const childOldNode = oldGraphNodeMap.get(childNode.id)!;
        childNode.position(childOldNode.x + parentDx, childOldNode.y + parentDy);
      });

      inactiveGraphNodes.forEach((inactiveNode) => {
        // GraphNodesMap.get() will never return undefined because the if condition above checks for that.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const inactiveOldNode = oldGraphNodeMap.get(inactiveNode.id)!;
        inactiveNode.fix(inactiveOldNode.x + parentDx, inactiveOldNode.y + parentDy);
      });
    } else {
      graphChildrenNodes.forEach((childNode, index) => {
        const x = center.x + 120 * Math.sin((index / graphChildrenNodes.length) * 2 * Math.PI);
        const y = center.y - 120 * Math.cos((index / graphChildrenNodes.length) * 2 * Math.PI);
        childNode.position(x, y);
      });

      const parentOldNode = oldGraphNodeMap.get(graphParentNode.id);
      const [parentDx, parentDy] = parentOldNode ? [center.x - parentOldNode.x, center.y - parentOldNode.y] : [0, 0];

      inactiveGraphNodes.forEach((inactiveNode) => {
        const oldInactiveNode = oldGraphNodeMap.get(inactiveNode.id);
        if (oldInactiveNode) {
          inactiveNode.fix(oldInactiveNode.x + parentDx, oldInactiveNode.y + parentDy);
        }
      });
    }

    this.nodeSelection = this.nodeSelection.data(graphNodes, (node) => node.id);
    this.nodeSelection.exit().remove();

    const inactiveGraphNodeIds = new Set(inactiveGraphNodes.map((node) => node.id));
    const graphNodeClassName = (node: GraphNode) => {
      const classNames = [styles.GraphNode];
      if (inactiveGraphNodeIds.has(node.id)) {
        classNames.push(styles.GraphNode__inactive);
      }
      return classNames.join(' ');
    };

    const enteredNodeSelection = this.nodeSelection.enter().append('g');
    enteredNodeSelection.append('circle');
    enteredNodeSelection.append('rect');
    enteredNodeSelection.append('text');

    this.nodeSelection = enteredNodeSelection
      .merge(this.nodeSelection)
      .sort()
      .attr('aria-disabled', (node) => (inactiveGraphNodeIds.has(node.id) ? true : null))
      .attr('data-star-graph', (node) => {
        if (node.id === graphParentNode.id) return 'parent-node';
        if (inactiveGraphNodeIds.has(node.id)) return 'inactive-node';
        return 'child-node';
      });

    this.nodeSelection
      .select<SVGCircleElement>('circle')
      .attr('class', graphNodeClassName)
      .attr('r', (node) => (node === graphParentNode ? 20 : 16));

    this.nodeSelection
      .select<SVGTextElement>('text')
      .attr('class', graphNodeClassName)
      .text((node) => node.name);

    const boundingBoxes = this.nodeSelection
      .select<SVGTextElement>('text')
      .nodes()
      .map((node) => node.getBBox());

    this.nodeSelection
      .select<SVGRectElement>('rect')
      .attr('class', graphNodeClassName)
      .attr('x', (node, index) => boundingBoxes[index].x - 4)
      .attr('y', (node, index) => boundingBoxes[index].y - 2)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', (node, index) => boundingBoxes[index].width + 8)
      .attr('height', (node, index) => boundingBoxes[index].height + 4);

    const childNodeIds = new Set(graphChildrenNodes.map((node) => node.id));

    this.nodeSelection.on('.drag', null).call(this.menuLogic.behavior<GraphNode>(graphNodeNenuItems));

    this.nodeSelection
      .filter((node) => childNodeIds.has(node.id))
      .call(
        drag<SVGGElement, GraphNode>()
          .on('start', (event: DragEvent, node) => {
            node.fix(event.x, event.y);
            this.simulationLogic.start();
          })
          .on('drag', (event: MouseEvent, node) => {
            node.fix(event.x, event.y);
            this.simulationLogic.start();
          })
          .on('end', (_: MouseEvent, node) => {
            reorderGraphChildren((node) => {
              const atan2 = Math.atan2(node.x - center.x, -(node.y - center.y));
              return atan2 >= 0 ? atan2 : atan2 + 2 * Math.PI;
            });
            node.unfix();
          }),
      );
    this.nodeSelection.call(this.menuLogic.behavior<GraphNode>(graphNodeNenuItems));
  }

  public destroy(): void {
    if (!this.nodeRootSelection) return;
    this.nodeRootSelection.remove();
  }
}

export default GraphNodeLogic;
