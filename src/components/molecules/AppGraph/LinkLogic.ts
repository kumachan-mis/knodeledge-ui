import GraphLink from './GraphLink';

import { Selection } from 'd3-selection';

class LinkLogic {
  private rootSelection: Selection<SVGGElement, unknown, null, undefined> | null;
  private selection: Selection<SVGGElement, GraphLink, SVGGElement, unknown> | null;

  constructor() {
    this.rootSelection = null;
    this.selection = null;
  }

  public init(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.rootSelection = svgSelection.append('g');
    this.selection = this.rootSelection.append('g').selectAll<SVGGElement, GraphLink>('g');
  }

  public onTick(): void {
    if (!this.selection) return;

    this.selection
      .select('line')
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);

    this.selection.select('text').attr('transform', (link) => {
      return `translate(${(link.source.x + link.target.x) / 2},${(link.source.y + link.target.y) / 2})`;
    });
  }

  public update(graphLinks: GraphLink[]): void {
    if (!this.selection) return;

    this.selection = this.selection.data(graphLinks);
    this.selection.exit().remove();

    const enteredSelection = this.selection.enter().append('g');
    enteredSelection.append('line');
    enteredSelection.append('text');

    this.selection = enteredSelection.merge(this.selection);

    this.selection.select('line').attr('stroke-width', 2);
    this.selection.select('text').text((link) => link.relation);
  }

  public destroy(): void {
    if (!this.rootSelection) return;
    this.rootSelection.remove();
  }
}

export default LinkLogic;
