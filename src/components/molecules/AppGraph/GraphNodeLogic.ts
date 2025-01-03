import GraphNode from './GraphNode';
import GraphSimulationLogic from './GraphSimulationLogic';
import styles from './styles.module.scss';

import { drag } from 'd3-drag';
import { Selection } from 'd3-selection';

class GraphNodeLogic {
  private graphSimulationLogic: GraphSimulationLogic;
  private rootSelection: Selection<SVGGElement, unknown, null, undefined> | null;
  private selection: Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null;

  constructor(graphSimulationLogic: GraphSimulationLogic) {
    this.graphSimulationLogic = graphSimulationLogic;
    this.rootSelection = null;
    this.selection = null;
  }

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

  public update(graphParent: GraphNode, graphChildren: GraphNode[]): void {
    if (!this.selection) return;

    this.selection = this.selection.data([graphParent, ...graphChildren]);
    this.selection.exit().remove();

    const enteredSelection = this.selection.enter().append('g');
    enteredSelection.append('circle').attr('class', styles.GraphNode);
    enteredSelection.append('rect').attr('class', styles.GraphNode);
    enteredSelection.append('text').attr('class', styles.GraphNode);

    this.selection = enteredSelection.merge(this.selection);
    this.selection.select<SVGCircleElement>('circle').attr('r', (node) => (node === graphParent ? 20 : 16));
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

    this.selection.call(
      drag<SVGGElement, GraphNode>()
        .on('start', (event: DragEvent, node) => {
          if (node === graphParent) return;
          node.fix(event.x, event.y);
          this.graphSimulationLogic.start(1.0);
        })
        .on('drag', (event: MouseEvent, node) => {
          if (node === graphParent) return;
          node.fix(event.x, event.y);
          this.graphSimulationLogic.start(1.0);
        })
        .on('end', (_: MouseEvent, node) => {
          if (node === graphParent) return;
          node.unfix();
          this.graphSimulationLogic.start();
        }),
    );
  }

  public destroy(): void {
    if (!this.rootSelection) return;
    this.rootSelection.remove();
  }
}

export default GraphNodeLogic;
