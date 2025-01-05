type GraphChildWithId = {
  readonly id: string;
  readonly name: string;
  readonly relation: string;
  readonly description: string;
  readonly children: GraphChildWithId[];
};

export default GraphChildWithId;
