import { GraphEntityLogicReturn } from './GraphEntityLogic';
import GraphLink from './GraphLink';
import GraphMenuLogic from './GraphMenuLogic';
import styles from './styles.module.scss';

import { Selection } from 'd3-selection';

class GraphLinkLogic {
  private svgSelection: Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private linkRootSelection: Selection<SVGGElement, unknown, null, undefined> | null = null;
  private linkSelection: Selection<SVGGElement, GraphLink, SVGGElement, unknown> | null = null;
  private descRootSelection: Selection<SVGGElement, unknown, null, undefined> | null = null;
  private descSelection: Selection<SVGGElement, GraphLink, SVGGElement, unknown> | null = null;
  private descTimerId = 0;

  public constructor(private readonly menuLogic: GraphMenuLogic) {}

  public initLink(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.svgSelection = svgSelection;
    this.linkRootSelection = svgSelection.append('g');
    this.linkSelection = this.linkRootSelection.selectAll<SVGGElement, GraphLink>('g');
  }

  public initDesc(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>): void {
    this.svgSelection = svgSelection;
    this.descRootSelection = svgSelection.append('g');
    this.descSelection = this.descRootSelection.selectAll<SVGGElement, GraphLink>('g');
  }

  public onTick(): void {
    if (!this.linkSelection || !this.descSelection) return;

    this.linkSelection
      .select<SVGLineElement>('line')
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);

    this.linkSelection.select<SVGTextElement>('text').attr('transform', (link) => {
      return `translate(${(link.source.x + link.target.x) / 2},${(link.source.y + link.target.y) / 2})`;
    });

    this.descSelection.select<SVGRectElement>('rect').attr('transform', (link) => {
      if (link.target.y - link.source.y >= 0) {
        return `translate(${(link.source.x + link.target.x) / 2 - 80},${(link.source.y + link.target.y) / 2 + 12})`;
      } else {
        return `translate(${(link.source.x + link.target.x) / 2 - 80},${(link.source.y + link.target.y) / 2 - 80 - 12})`;
      }
    });

    this.descSelection.select<SVGForeignObjectElement>('foreignObject').attr('transform', (link) => {
      if (link.target.y - link.source.y >= 0) {
        return `translate(${(link.source.x + link.target.x) / 2 - 78},${(link.source.y + link.target.y) / 2 + 10})`;
      } else {
        return `translate(${(link.source.x + link.target.x) / 2 - 78},${(link.source.y + link.target.y) / 2 - 80 - 10})`;
      }
    });
  }

  public update({
    graphLinks,
    focusedLink,
    inactiveGraphLinks,
    graphLinkMenuItems,
    focusGraphLink,
    blurGraphLink,
  }: GraphEntityLogicReturn): void {
    if (!this.linkSelection || !this.descSelection) return;

    this.linkSelection = this.linkSelection.data([...inactiveGraphLinks, ...graphLinks], (link) => link.id);
    this.linkSelection.exit().remove();
    this.descSelection = this.descSelection.data([...inactiveGraphLinks, ...graphLinks], (link) => link.id);
    this.descSelection.exit().remove();

    const inactiveGraphLinkIds = new Set(inactiveGraphLinks.map((link) => link.id));
    const graphLinkClassName = (link: GraphLink) => {
      const className = [styles.GraphLink];
      if (link.id === focusedLink?.id) {
        className.push(styles.GraphLink__focused);
      }
      if (inactiveGraphLinkIds.has(link.id)) {
        className.push(styles.GraphLink__inactive);
      }
      return className.join(' ');
    };

    const enteredLinkSelection = this.linkSelection.enter().append('g');
    enteredLinkSelection.append('line');
    enteredLinkSelection.append('text');

    const enteredDescSelection = this.descSelection.enter().append('g');
    enteredDescSelection.append('rect');
    enteredDescSelection.append('foreignObject').append('xhtml:div');

    this.linkSelection = enteredLinkSelection
      .merge(this.linkSelection)
      .sort()
      .attr('aria-selected', (link) => (link.id === focusedLink?.id ? true : null))
      .attr('aria-disabled', (link) => (inactiveGraphLinkIds.has(link.id) ? true : null))
      .attr('data-star-graph', (link) => {
        if (inactiveGraphLinkIds.has(link.id)) return 'inactive-link';
        return 'link';
      });

    this.descSelection = enteredDescSelection
      .merge(this.descSelection)
      .sort()
      .attr('aria-disabled', (link) => (inactiveGraphLinkIds.has(link.id) ? true : null))
      .attr('data-star-graph', (link) => {
        if (inactiveGraphLinkIds.has(link.id)) return 'inactive-descrition';
        return 'descrition';
      })
      .style('display', 'none');

    this.linkSelection.select<SVGLineElement>('line').attr('class', graphLinkClassName);

    this.linkSelection
      .select<SVGTextElement>('text')
      .attr('class', graphLinkClassName)
      .text((link) => link.relation);

    this.descSelection
      .select<SVGRectElement>('rect')
      .attr('class', graphLinkClassName)
      .attr('width', 160)
      .attr('height', 80);

    this.descSelection
      .select<SVGForeignObjectElement>('foreignObject')
      .attr('class', graphLinkClassName)
      .attr('width', 156)
      .attr('height', 76)
      .select('div')
      .text((link) => link.description);

    this.linkSelection
      .on('mouseenter', (event: MouseEvent, link) => {
        if (inactiveGraphLinkIds.has(link.id)) return;
        this.descTimerId = window.setTimeout(() => {
          const selection = this.descSelection?.filter((d) => d.id === link.id);
          if (!selection) return;
          selection.style('display', null);
        }, 300);
      })
      .on('mouseleave', (event: MouseEvent, link) => {
        if (this.descTimerId > 0) {
          window.clearTimeout(this.descTimerId);
          this.descTimerId = 0;
        }
        const selection = this.descSelection?.filter((d) => d.id === link.id);
        if (!selection) return;
        selection.style('display', 'none');
      })
      .on('click', (event: MouseEvent, link) => {
        if (inactiveGraphLinkIds.has(link.id)) return;
        event.stopPropagation();
        this.menuLogic.hide();
        focusGraphLink(link);
      })
      .call(this.menuLogic.behavior<GraphLink>(graphLinkMenuItems));

    this.descSelection
      .on('mouseenter', (event: MouseEvent, link) => {
        if (inactiveGraphLinkIds.has(link.id)) return;
        this.descTimerId = window.setTimeout(() => {
          const selection = this.descSelection?.filter((d) => d.id === link.id);
          if (!selection) return;
          selection.style('display', null);
        }, 300);
      })
      .on('mouseleave', (event: MouseEvent, link) => {
        if (this.descTimerId > 0) {
          window.clearTimeout(this.descTimerId);
          this.descTimerId = 0;
        }
        const selection = this.descSelection?.filter((d) => d.id === link.id);
        if (!selection) return;
        selection.style('display', 'none');
      });

    if (!this.svgSelection) return;
    this.svgSelection.on('click', () => {
      blurGraphLink();
    });
  }

  public destroy(): void {
    if (!this.svgSelection) return;
    this.svgSelection.on('click', null);

    if (this.linkRootSelection) this.linkRootSelection.remove();
    if (this.descRootSelection) this.descRootSelection.remove();
  }
}

export default GraphLinkLogic;
