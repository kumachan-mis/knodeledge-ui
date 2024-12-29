export type LoadableServerSideData<D> = {
  state: 'success';
  data: D;
};

export type LoadableClientSideData<D> =
  | {
      state: 'success';
      data: D;
    }
  | {
      state: 'loading';
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
