import { GraphEntityLogicReturn } from './GraphEntityLogic';
import GraphLink from './GraphLink';
import GraphMenuLogic from './GraphMenuLogic';
import styles from './styles.module.scss';

import { Selection } from 'd3-selection';

class GraphLinkLogic {
  private rootSelection: Selection<SVGGElement, unknown, null, undefined> | null = null;
  private selection: Selection<SVGGElement, GraphLink, SVGGElement, unknown> | null = null;

  public constructor(private menuLogic: GraphMenuLogic) {}

  public init(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.rootSelection = svgSelection.append('g');
    this.selection = this.rootSelection.append('g').selectAll<SVGGElement, GraphLink>('g');
  }

  public onTick(): void {
    if (!this.selection) return;

    this.selection
      .select<SVGLineElement>('line')
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);

    this.selection.select<SVGTextElement>('text').attr('transform', (link) => {
      return `translate(${(link.source.x + link.target.x) / 2},${(link.source.y + link.target.y) / 2})`;
    });
  }

  public update({ graphLinks, deleteGraphLink, focusGraphLink }: GraphEntityLogicReturn): void {
    if (!this.selection) return;

    this.selection = this.selection.data(graphLinks);
    this.selection.exit().remove();

    const enteredSelection = this.selection.enter().append('g');
    enteredSelection.append('line').attr('class', styles.GraphLink);
    enteredSelection.append('text').attr('class', styles.GraphLink);

    this.selection = enteredSelection.merge(this.selection);

    this.selection.select<SVGTextElement>('text').text((link) => link.relation);

    this.selection
      .call((selection) => {
        selection.on('click', (event, link) => {
          focusGraphLink(link);
        });
      })
      .call(
        this.menuLogic.behavior<GraphLink>([
          {
            name: 'Delete',
            onClick: (event, link) => {
              deleteGraphLink(link);
            },
          },
        ]),
      );
  }

  public destroy(): void {
    if (!this.rootSelection) return;
    this.rootSelection.remove();
  }
}

export default GraphLinkLogic;
