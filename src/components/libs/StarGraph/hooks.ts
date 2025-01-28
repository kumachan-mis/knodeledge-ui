import { StarGraphChildWithId, useSetStarGraphContent, useStarGraphContent, useStarGraphRoot } from './context';

import { StarGraphProps } from './index';

import React from 'react';

export function useStarGraph(): StarGraphProps {
  const graphRoot = useStarGraphRoot();
  const graphContent = useStarGraphContent();
  const setGraphContent = useSetStarGraphContent();

  const setGraphRootChildren = React.useCallback(
    (value: React.SetStateAction<StarGraphChildWithId[]>) => {
      setGraphContent((prev) => {
        const updated = typeof value === 'function' ? value(prev.graphRootChildren) : value;
        return { ...prev, graphRootChildren: updated };
      });
    },
    [setGraphContent],
  );

  const setFocusedGraphParentId = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraphContent((prev) => {
        const updated = typeof value === 'function' ? value(prev.focusedGraphParentId) : value;
        return { ...prev, focusedGraphParentId: updated, focusedGraphChildId: '' };
      });
    },
    [setGraphContent],
  );

  const setFocusedGraphChildId = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraphContent((prev) => {
        const updated = typeof value === 'function' ? value(prev.focusedGraphChildId) : value;
        return { ...prev, focusedGraphChildId: updated };
      });
    },
    [setGraphContent],
  );

  return {
    graphRoot,
    ...graphContent,
    setGraphRootChildren,
    setFocusedGraphParentId,
    setFocusedGraphChildId,
  };
}
