export type LoadableData<D> =
  | {
      state: 'loading';
      data: null;
    }
  | {
      state: 'success';
      data: D;
    }
  | {
      state: 'notfound';
      data: null;
    };

export type LoadableAction<E> =
  | {
      state: 'success';
      error: null;
    }
  | {
      state: 'error';
      error: E;
    };

export type Panic =
  | {
      state: 'healthy';
      message: null;
    }
  | {
      state: 'panic';
      message: string;
    };
