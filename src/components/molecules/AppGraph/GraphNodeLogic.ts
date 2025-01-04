import { GraphEntityLogicReturn } from './GraphEntityLogic';
import GraphMenuLogic from './GraphMenuLogic';
import GraphNode from './GraphNode';
import GraphSimulationLogic from './GraphSimulationLogic';
import styles from './styles.module.scss';

import { drag } from 'd3-drag';
import { Selection } from 'd3-selection';

class GraphNodeLogic {
  private rootSelection: Selection<SVGGElement, unknown, null, undefined> | null = null;
  private selection: Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null = null;

  public constructor(
    private readonly menuLogic: GraphMenuLogic,
    private readonly simulationLogic: GraphSimulationLogic,
  ) {}

  public init(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.rootSelection = svgSelection.append('g');
    this.selection = this.rootSelection.selectAll<SVGGElement, GraphNode>('g');
  }

  public onTick(): void {
    if (!this.selection) return;

    this.selection
      .select<SVGCircleElement>('circle')
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);

    this.selection.select<SVGRectElement>('rect').attr('transform', (node) => `translate(${node.x},${node.y + 20})`);

    this.selection.select<SVGTextElement>('text').attr('transform', (node) => `translate(${node.x},${node.y + 20})`);
  }

  public update({ graphParentNode, graphChildrenNodes, deleteGraphNode, center }: GraphEntityLogicReturn): void {
    if (!this.selection) return;

    graphParentNode.fix(center.x, center.y);

    const oldGraphNodeMap = new Map(this.selection.data().map((node) => [node.id, node]));
    const graphNodes = [graphParentNode, ...graphChildrenNodes];
    if (graphNodes.length === oldGraphNodeMap.size && graphNodes.every((node) => oldGraphNodeMap.has(node.id))) {
      // GraphNodesMap.get() will never return undefined because the if condition above checks for that.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const oldParentNode = oldGraphNodeMap.get(graphParentNode.id)!;
      const [parentDx, parentDy] = [graphParentNode.x - oldParentNode.x, graphParentNode.y - oldParentNode.y];

      graphChildrenNodes.forEach((childNode) => {
        // GraphNodesMap.get() will never return undefined because the if condition above checks for that.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const oldChildNode = oldGraphNodeMap.get(childNode.id)!;
        childNode.position(oldChildNode.x + parentDx, oldChildNode.y + parentDy);
      });
    } else {
      graphChildrenNodes.forEach((childNode, index) => {
        const x = center.x + 120 * Math.sin((index / graphChildrenNodes.length) * 2 * Math.PI);
        const y = center.y - 120 * Math.cos((index / graphChildrenNodes.length) * 2 * Math.PI);
        childNode.position(x, y);
      });
    }

    this.selection = this.selection.data(graphNodes, (node) => node.id);
    this.selection.exit().remove();

    const enteredSelection = this.selection.enter().append('g');
    enteredSelection.append('circle').attr('class', styles.GraphNode);
    enteredSelection.append('rect').attr('class', styles.GraphNode);
    enteredSelection.append('text').attr('class', styles.GraphNode);

    this.selection = enteredSelection.merge(this.selection);
    this.selection.select<SVGCircleElement>('circle').attr('r', (node) => (node === graphParentNode ? 20 : 16));
    this.selection.select<SVGTextElement>('text').text((node) => node.name);

    const boundingBoxes = this.selection
      .select<SVGTextElement>('text')
      .nodes()
      .map((node) => node.getBBox());

    this.selection
      .select<SVGRectElement>('rect')
      .attr('x', (node, index) => boundingBoxes[index].x - 4)
      .attr('y', (node, index) => boundingBoxes[index].y - 2)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', (node, index) => boundingBoxes[index].width + 8)
      .attr('height', (node, index) => boundingBoxes[index].height + 4);

    this.selection
      .call(
        drag<SVGGElement, GraphNode>()
          .on('start', (event: DragEvent, node) => {
            if (node === graphParentNode) return;
            node.fix(event.x, event.y);
            this.simulationLogic.start();
          })
          .on('drag', (event: MouseEvent, node) => {
            if (node === graphParentNode) return;
            node.fix(event.x, event.y);
            this.simulationLogic.start();
          })
          .on('end', (_: MouseEvent, node) => {
            if (node === graphParentNode) return;
            node.unfix();
          }),
      )
      .call(
        this.menuLogic.behavior<GraphNode>([
          {
            name: 'Delete',
            onClick: (event, node) => {
              deleteGraphNode(node);
            },
            disabled: (node) => node === graphParentNode,
          },
        ]),
      );
  }

  public destroy(): void {
    if (!this.rootSelection) return;
    this.rootSelection.remove();
  }
}

export default GraphNodeLogic;
