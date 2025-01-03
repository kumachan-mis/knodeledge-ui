'use client';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/openapi/graphs';
import { useGraphContent, useSetGraphContent } from '@/contexts/views/graph';
import { GraphChild } from '@/openapi';

import React from 'react';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const graphRoot = loadableGraph.data?.name ?? '';
  const graph = useGraphContent();
  const setGraph = useSetGraphContent();

  const setGraphChildren = React.useCallback(
    (value: React.SetStateAction<GraphChild[]>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.children) : value;
        if (updated.length === prev.children.length) {
          return { ...prev, children: updated };
        }
        return { ...prev, children: updated, focusedChildIndex: -1 };
      });
    },
    [setGraph],
  );

  const setFocusedGraphChildIndex = React.useCallback(
    (value: React.SetStateAction<number>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.focusedChildIndex) : value;
        return { ...prev, focusedChildIndex: updated };
      });
    },
    [setGraph],
  );

  return (
    <AppGraph
      focusedGraphChildIndex={graph.focusedChildIndex}
      graphChildren={graph.children}
      graphRoot={graphRoot}
      setFocusedGraphChildIndex={setFocusedGraphChildIndex}
      setGraphChildren={setGraphChildren}
      state={loadableGraph.state}
    />
  );
};

export default SectionViewGraphComponent;
