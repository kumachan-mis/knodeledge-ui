import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

import { forceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';

class GraphSimulationLogic {
  private simulation: Simulation<GraphNode, GraphLink> | null;

  public constructor() {
    this.simulation = null;
  }

  public init(onTick: () => void): void {
    this.simulation = forceSimulation<GraphNode, GraphLink>().on('tick', onTick);
  }

  public update(graphParent: GraphNode, graphChildren: GraphNode[], graphLinks: GraphLink[]): void {
    if (!this.simulation) return;

    const links = [...graphLinks];
    const nodes = [graphParent, ...graphChildren];

    this.simulation
      .nodes(nodes)
      .force('forceManyBody', forceManyBody().strength(-600))
      .force('forceLink', forceLink(links).distance(160).strength(1));
  }

  public start(alpha = 0.25): void {
    if (!this.simulation) return;
    this.simulation.alpha(alpha).restart();
  }

  public stop(): void {
    if (!this.simulation) return;
    this.simulation.stop();
  }

  public destroy(): void {
    if (!this.simulation) return;
    this.simulation.force('forceLink', null);
    this.simulation.force('forceManyBody', null);
    this.simulation.on('tick', null);
  }
}

export default GraphSimulationLogic;
