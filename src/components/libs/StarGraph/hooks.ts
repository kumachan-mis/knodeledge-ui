import { StarGraphChildWithId, StarGraphRootWithId } from './context';

import { StarGraphProps } from './index';

import React from 'react';

export type StarGraphContent = {
  readonly graphRootChildren: StarGraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
};

export type UseStarGraphProps = {
  readonly graphRoot: StarGraphRootWithId;
  readonly graphContent: StarGraphContent;
  readonly setGraphContent: React.Dispatch<React.SetStateAction<StarGraphContent>>;
};

export function useStarGraph({ setGraphContent, graphRoot, graphContent }: UseStarGraphProps): StarGraphProps {
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
