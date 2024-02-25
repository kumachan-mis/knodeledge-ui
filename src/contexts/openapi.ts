export type LoadableData<D> =
  | {
      state: 'loading';
      data: null;
      error: null;
    }
  | {
      state: 'success';
      data: D;
      error: null;
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
