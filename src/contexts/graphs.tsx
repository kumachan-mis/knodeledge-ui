'use client';
import { findGraph } from '@/actions/graphs/findGraph';
import { Graph } from '@/openapi';

import { LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadableGraph = LoadableData<Graph>;

export type LoadableGraphMap = Map<string, LoadableGraph>;

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
    if (graphMap.get(sectionId)?.state === 'success') {
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

export const GraphContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [graphMap, setGraphMap] = React.useState<LoadableGraphMap>(new Map());

  return (
    <GraphMapValueContext.Provider value={graphMap}>
      <GraphMapSetContext.Provider value={setGraphMap}>{children}</GraphMapSetContext.Provider>
    </GraphMapValueContext.Provider>
  );
};
