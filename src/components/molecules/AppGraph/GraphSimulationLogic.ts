import { GraphEntityLogicReturn } from './GraphEntityLogic';
import GraphLink from './GraphLink';
import GraphNode from './GraphNode';

import { forceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';

class GraphSimulationLogic {
  private simulation: Simulation<GraphNode, GraphLink> | null = null;

  public init(onTick: () => void): void {
    this.simulation = forceSimulation<GraphNode, GraphLink>().on('tick', onTick);
  }

  public update({ graphParentNode, graphChildrenNodes, graphLinks }: GraphEntityLogicReturn): void {
    if (!this.simulation) return;

    this.simulation
      .nodes([graphParentNode, ...graphChildrenNodes])
      .force('forceManyBody', forceManyBody().strength(-500))
      .force('forceLink', forceLink(graphLinks).distance(150).strength(1));
  }

  public start(): void {
    if (!this.simulation) return;
    this.simulation.alpha(1.0).alphaTarget(0.0).restart();
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
