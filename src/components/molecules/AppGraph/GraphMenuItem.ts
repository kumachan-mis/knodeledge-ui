type GraphMenuItem<Datum> = {
  readonly name: string;
  readonly onClick: (event: MouseEvent, datum: Datum) => void;
  readonly disabled?: (datum: Datum) => boolean;
};

export default GraphMenuItem;
