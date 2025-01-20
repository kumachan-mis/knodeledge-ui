import GraphChildWithId from './GraphChildWithId';
import GraphRootWithId from './GraphRootWithId';

import { StarGraphProps } from './index';

import React from 'react';

export type StarGraphContent = {
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
};

export type UseStarGraphProps = {
  readonly graphRoot: GraphRootWithId;
  readonly graphContent: StarGraphContent;
  readonly setGraphContent: React.Dispatch<React.SetStateAction<StarGraphContent>>;
};

export function useStarGraph({ setGraphContent, graphRoot, graphContent }: UseStarGraphProps): StarGraphProps {
  const setFocusedGraphChildren = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId[]>) => {
      setGraphContent((prev) => {
        const focusedParent = prev.graphRootChildren.find((child) => child.id === prev.focusedGraphParentId);

        const prevChildren = focusedParent ? focusedParent.children : prev.graphRootChildren;
        const children = typeof value === 'function' ? value(prevChildren) : value;

        const updated = focusedParent
          ? prev.graphRootChildren.map((child) => (child === focusedParent ? { ...child, children } : child))
          : children;

        if (children.length === prevChildren.length) {
          return { ...prev, graphRootChildren: updated };
        }
        return { ...prev, graphRootChildren: updated, focusedGraphChildId: '' };
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

  return { graphRoot, ...graphContent, setFocusedGraphChildren, setFocusedGraphParentId, setFocusedGraphChildId };
}
