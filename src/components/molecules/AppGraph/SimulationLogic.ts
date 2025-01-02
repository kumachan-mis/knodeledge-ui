import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

import { forceLink, forceManyBody, forceSimulation, forceX, forceY, Simulation } from 'd3-force';

class SimulationLogic {
  private simulation: Simulation<GraphNode, GraphLink> | null;

  public constructor() {
    this.simulation = null;
  }

  public init(onTick: () => void): void {
    this.simulation = forceSimulation<GraphNode, GraphLink>().on('tick', onTick);
  }

  public update(
    graphParent: GraphNode,
    graphChildren: GraphNode[],
    graphLinks: GraphLink[],
    center: { x: number; y: number },
  ): void {
    if (!this.simulation) return;

    const links = [...graphLinks];
    const nodes = [graphParent, ...graphChildren];

    this.simulation
      .nodes(nodes)
      .force('forceX', forceX().x(center.x).strength(0.1))
      .force('forceY', forceY().y(center.y).strength(0.1))
      .force('forceManyBody', forceManyBody().strength(-600))
      .force('forceLink', forceLink(links).distance(200).strength(0.03));
  }

  public start(): void {
    if (!this.simulation) return;
    this.simulation.alpha(0.2).restart();
  }

  public stop(): void {
    if (!this.simulation) return;
    this.simulation.stop();
  }

  public destroy(): void {
    if (!this.simulation) return;
    this.simulation.force('forceLink', null);
    this.simulation.force('forceManyBody', null);
    this.simulation.force('forceX', null);
    this.simulation.force('forceY', null);
    this.simulation.on('tick', null);
  }
}

export default SimulationLogic;
