import GraphLink from './GraphLink';
import GraphNode from './GraphNode';
import { GraphEntityReturn } from './graphEntity.hooks';

import { forceLink, forceManyBody, forceSimulation, Simulation } from 'd3-force';
import { Selection } from 'd3-selection';

class GraphSimulationLogic {
  private svgSelection: Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private simulation: Simulation<GraphNode, GraphLink> | null = null;
  private center: { x: number; y: number } = { x: 0, y: 0 };

  public init(svgSelection: Selection<SVGSVGElement, unknown, null, undefined>, onTick: () => void): void {
    this.svgSelection = svgSelection;
    this.simulation = forceSimulation<GraphNode, GraphLink>().on('tick', onTick);
  }

  public update({ graphParentNode, graphChildrenNodes, graphLinks }: GraphEntityReturn): void {
    const svgElement = this.svgSelection?.node();
    if (!svgElement || !this.simulation) return;

    const oldGraphNodeIds = new Set(this.simulation.nodes().map((node) => node.id));

    this.simulation
      .nodes([graphParentNode, ...graphChildrenNodes])
      .force('forceManyBody', forceManyBody().strength(-500))
      .force('forceLink', forceLink(graphLinks).distance(150).strength(1));

    const svgClientRect = svgElement.getBoundingClientRect();
    const center: { x: number; y: number } = { x: svgClientRect.width / 2, y: svgClientRect.height / 2 };
    if (center.x !== this.center.x || center.y !== this.center.y) {
      this.center = center;
      this.start();
      return;
    }

    const graphNodeIds = new Set(this.simulation.nodes().map((node) => node.id));
    if (!oldGraphNodeIds.isSubsetOf(graphNodeIds) || !graphNodeIds.isSubsetOf(oldGraphNodeIds)) {
      this.start();
    }
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
