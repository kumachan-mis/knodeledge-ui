'use client';
import { deleteGraph } from '@/actions/graphs/deleteGraph';
import { findGraph } from '@/actions/graphs/findGraph';
import { updateGraph } from '@/actions/graphs/updateGraph';
import { Graph, GraphContentWithoutAutofield, GraphContentWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { useSetPanic } from './panic';
import { LoadableAction, LoadableClientSideData } from './types';

import React from 'react';

export type LoadableGraph = LoadableClientSideData<Graph>;

export type LoadableGraphMap = Map<string, LoadableGraph>;

export type GraphActionError = {
  message: string;
  graph: Required<GraphContentWithoutAutofieldError>;
};

export type LoadableActionGraphUpdate = (
  id: string,
  graph: GraphContentWithoutAutofield,
) => Promise<LoadableAction<GraphActionError>>;

export type LoadableActionGraphDelete = (sectionId: string) => Promise<LoadableAction<GraphActionError>>;

const EMPTY_GRAPH_ACTION_ERROR: GraphActionError = {
  message: '',
  graph: { paragraph: '', children: { message: '', items: [] } },
} as const;

const UNKNOWN_GRAPH_ACTION_ERROR: GraphActionError = {
  message: 'unknown error',
  graph: { paragraph: 'unknown error', children: { message: 'unknown error', items: [] } },
} as const;

const GraphMapValueContext = React.createContext<LoadableGraphMap>(new Map());

const GraphMapSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableGraphMap>>>(() => {
  // Do nothing
});

export function useLoadableGraph(sectionId: string): LoadableGraph {
  const graphMap = React.useContext(GraphMapValueContext);
  return graphMap.get(sectionId) ?? { state: 'loading', data: null };
}

export function useInitGraph(userId: string, projectId: string, chapterId: string, sectionId: string): void {
  const graphMap = React.useContext(GraphMapValueContext);
  const setGraphMap = React.useContext(GraphMapSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    const loadableGraph = graphMap.get(sectionId);
    if (loadableGraph?.state === 'success') {
      return;
    }

    setGraphMap((prev) => new Map(prev.set(sectionId, { state: 'loading', data: null })));

    void (async () => {
      const errorable = await findGraph({
        user: { id: userId },
        project: { id: projectId },
        chapter: { id: chapterId },
        section: { id: sectionId },
      });

      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
        return;
      }

      if (errorable.state === 'error') {
        setGraphMap((prev) => new Map(prev.set(sectionId, { state: 'notfound', data: null })));
        return;
      }

      setGraphMap((prev) => new Map(prev.set(sectionId, { state: 'success', data: errorable.response.graph })));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, projectId, chapterId, sectionId]);
}

export function useUpdateGraph(
  user: UserOnlyId,
  projectId: string,
  chapterId: string,
  sectionId: string,
): LoadableActionGraphUpdate {
  const setPanic = useSetPanic();
  const graphMap = React.useContext(GraphMapValueContext);
  const setGraphMap = React.useContext(GraphMapSetContext);

  return async (id, graph) => {
    const loadableGraph = graphMap.get(sectionId);
    if (loadableGraph?.state !== 'success') {
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }
    const errorable = await updateGraph({
      user,
      project: { id: projectId },
      chapter: { id: chapterId },
      graph: { id, ...graph },
    });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }

    if (
      errorable.state === 'error' &&
      (!!errorable.error.user?.id || !!errorable.error.project?.id || !!errorable.error.chapter?.id)
    ) {
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }
    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          graph: { ...EMPTY_GRAPH_ACTION_ERROR.graph, ...errorable.error.graph },
        },
      };
    }

    setGraphMap((prev) => new Map(prev.set(sectionId, { state: 'success', data: errorable.response.graph })));
    return { state: 'success', error: null };
  };
}

export function useDeleteGraph(user: UserOnlyId, projectId: string, chapterId: string): LoadableActionGraphDelete {
  const setPanic = useSetPanic();
  const graphMap = React.useContext(GraphMapValueContext);
  const setGraphMap = React.useContext(GraphMapSetContext);

  return async (sectionId) => {
    const loadableGraph = graphMap.get(sectionId);
    if (loadableGraph?.state !== 'success') {
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }

    const errorable = await deleteGraph({
      user,
      project: { id: projectId },
      chapter: { id: chapterId },
      section: { id: sectionId },
    });

    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }

    if (
      errorable.state === 'error' &&
      (!!errorable.error.user?.id || !!errorable.error.project?.id || !!errorable.error.chapter?.id)
    ) {
      return { state: 'error', error: UNKNOWN_GRAPH_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          graph: { ...EMPTY_GRAPH_ACTION_ERROR.graph, ...errorable.error.section },
        },
      };
    }

    setGraphMap((prev) => new Map(prev.set(sectionId, { state: 'notfound', data: null })));
    return { state: 'success', error: null };
  };
}

export const CachedGraphContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [graphMap, setGraphMap] = React.useState<LoadableGraphMap>(new Map());

  return (
    <GraphMapValueContext.Provider value={graphMap}>
      <GraphMapSetContext.Provider value={setGraphMap}>{children}</GraphMapSetContext.Provider>
    </GraphMapValueContext.Provider>
  );
};
