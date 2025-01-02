import { SimulationNodeDatum } from 'd3-force';

class GraphNode implements SimulationNodeDatum {
  private _name: string;
  private _x: number;
  private _y: number;
  private _fx?: number;
  private _fy?: number;

  constructor(name: string, x: number, y: number) {
    this._name = name;
    this._x = x;
    this._y = y;
  }

  public get name(): string {
    return this._name;
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }

  public get fx(): number | undefined {
    return this._fx;
  }

  public get fy(): number | undefined {
    return this._fy;
  }

  public fix(fx: number, fy: number): void {
    this._fx = fx;
    this._fy = fy;
  }

  public unfix(): void {
    this._fx = undefined;
    this._fy = undefined;
  }
}

export default GraphNode;
