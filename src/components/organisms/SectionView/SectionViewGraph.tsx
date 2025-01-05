'use client';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/openapi/graphs';
import { GraphChildWithId, useGraphContent, useGraphContentRoot, useSetGraphContent } from '@/contexts/views/graph';

import styled from '@emotion/styled';
import React from 'react';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const graphRoot = useGraphContentRoot();
  const graph = useGraphContent();
  const setGraph = useSetGraphContent();

  const setFocusedGraphChildren = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId[]>) => {
      setGraph((prev) => {
        const focusedParent = prev.rootChildren.find((child) => child.id === prev.focusedParentId);

        const prevChildren = focusedParent ? focusedParent.children : prev.rootChildren;
        const children = typeof value === 'function' ? value(prevChildren) : value;

        const updated = focusedParent
          ? prev.rootChildren.map((child) => (child === focusedParent ? { ...child, children } : child))
          : children;

        if (children.length === prevChildren.length) {
          return { ...prev, rootChildren: updated };
        }
        return { ...prev, rootChildren: updated, focusedChildId: '' };
      });
    },
    [setGraph],
  );

  const setFocusedGraphParentId = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.focusedParentId) : value;
        return { ...prev, focusedParentId: updated, focusedChildId: '' };
      });
    },
    [setGraph],
  );

  const setFocusedGraphChildId = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.focusedChildId) : value;
        return { ...prev, focusedChildId: updated };
      });
    },
    [setGraph],
  );

  return (
    <SectionViewGraphRootComponent>
      <AppGraph
        focusedGraphChildId={graph.focusedChildId}
        focusedGraphParentId={graph.focusedParentId}
        graphRoot={graphRoot}
        graphRootChildren={graph.rootChildren}
        setFocusedGraphChildId={setFocusedGraphChildId}
        setFocusedGraphChildren={setFocusedGraphChildren}
        setFocusedGraphParentId={setFocusedGraphParentId}
        state={loadableGraph.state}
      />
    </SectionViewGraphRootComponent>
  );
};

const SectionViewGraphRootComponent = styled.div({
  '&': {
    width: '100%',
    height: '80%',
  },
});

export default SectionViewGraphComponent;
