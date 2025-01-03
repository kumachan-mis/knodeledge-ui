import GraphMenuItem from './GraphMenuItem';
import GraphSimulationLogic from './GraphSimulationLogic';
import styles from './styles.module.scss';

import { select, Selection } from 'd3-selection';

class GraphMenuLogic {
  private static readonly bodySelection = select('body');

  private rootSelection: Selection<HTMLDivElement, unknown, HTMLElement, unknown> | null = null;

  public constructor(private readonly simulationLogic: GraphSimulationLogic) {}

  public behavior<Datum>(
    menuItems: GraphMenuItem<Datum>[],
  ): (selection: Selection<SVGGElement, Datum, SVGGElement, unknown>) => void {
    return (selection) => {
      selection.on('contextmenu', (event: MouseEvent, datum) => {
        event.preventDefault();
        event.stopPropagation();
        this.show(menuItems, event, datum);
      });
    };
  }

  private show<Datum>(menuItems: GraphMenuItem<Datum>[], event: MouseEvent, datum: Datum): void {
    this.hide();

    this.simulationLogic.stop();

    this.rootSelection = GraphMenuLogic.bodySelection
      .append('div')
      .attr('role', 'presentation')
      .attr('class', styles.GraphMenu)
      .style('left', `${event.pageX}px`)
      .style('top', `${event.pageY}px`);

    this.rootSelection
      .append('ul')
      .attr('role', 'menu')
      .attr('class', styles.GraphMenu)
      .selectAll<HTMLDivElement, GraphMenuItem<Datum>>('li')
      .data(menuItems)
      .enter()
      .append('li')
      .attr('role', 'menuitem')
      .attr('class', (menuItem) => {
        const classNames = [styles.GraphMenu];
        if (menuItem.disabled?.(datum)) classNames.push(styles.GraphMenu__disabled);
        return classNames.join(' ');
      })
      .text((menuItem) => menuItem.name)
      .on('click', (event: MouseEvent, menuItem) => {
        if (menuItem.disabled?.(datum)) return;
        menuItem.onClick(event, datum);
        this.hide();
      });

    GraphMenuLogic.bodySelection.on('click', () => {
      this.hide();
    });
  }

  private hide(): void {
    if (!this.rootSelection) return;

    GraphMenuLogic.bodySelection.on('click', null);

    this.rootSelection.remove();
    this.rootSelection = null;

    this.simulationLogic.start();
  }
}

export default GraphMenuLogic;
