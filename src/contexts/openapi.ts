export type LoadableList<D> =
  | {
      state: 'loading';
      data: null;
    }
  | {
      state: 'success';
      data: D[];
    };

export type LoadableObject<D> =
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
