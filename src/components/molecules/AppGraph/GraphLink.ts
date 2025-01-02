import GraphNode from './GraphNode';

import { SimulationLinkDatum } from 'd3-force';

class GraphLink implements SimulationLinkDatum<GraphNode> {
  private _source: GraphNode;
  private _target: GraphNode;
  private _relation: string;
  private _description: string;

  constructor(source: GraphNode, target: GraphNode, relation: string, description: string) {
    this._source = source;
    this._target = target;
    this._relation = relation;
    this._description = description;
  }

  public get source(): GraphNode {
    return this._source;
  }

  public get target(): GraphNode {
    return this._target;
  }

  public get relation(): string {
    return this._relation;
  }

  public get description(): string {
    return this._description;
  }
}

export default GraphLink;
