import GraphNode from './GraphNode';

import { Selection } from 'd3-selection';

class NodeLogic {
  private rootSelection: Selection<SVGGElement, unknown, null, undefined> | null;
  private selection: Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null;

  constructor() {
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
      .select('circle')
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);

    this.selection.select('text').attr('transform', (node) => `translate(${node.x},${node.y})`);
  }

  public update(graphParent: GraphNode, graphChildren: GraphNode[]): void {
    if (!this.selection) return;

    this.selection = this.selection.data([graphParent, ...graphChildren]);
    this.selection.exit().remove();

    const enteredSelection = this.selection.enter().append('g');
    enteredSelection.append('circle');
    enteredSelection.append('text');

    this.selection = enteredSelection.merge(this.selection);
    this.selection.select('circle').attr('r', (node) => (node === graphParent ? 10 : 6));
    this.selection.select('text').text((node) => node.name);
  }

  public destroy(): void {
    if (!this.rootSelection) return;
    this.rootSelection.remove();
  }
}

export default NodeLogic;
