import { StarGraphChildWithId, StarGraphRootWithId } from './context';

import { StarGraphProps } from './index';

import React from 'react';

export type UseFocusedGraphReturn = {
  readonly focusedGraphParent: StarGraphRootWithId;
  readonly focusedGraphChildren: StarGraphChildWithId[];
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<StarGraphChildWithId[]>>;
};

export function useFocusedGraph({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  setGraphRootChildren,
  setFocusedGraphChildId,
}: StarGraphProps): UseFocusedGraphReturn {
  const graphParent = graphRootChildren.find((child) => child.id === focusedGraphParentId);

  const focusedGraphParent = graphParent ?? graphRoot;
  const focusedGraphChildren = graphParent?.children ?? graphRootChildren;

  const setFocusedGraphChildren = React.useCallback(
    (value: React.SetStateAction<StarGraphChildWithId[]>) => {
      setGraphRootChildren((prev) => {
        const prevFocusedParent = prev.find((child) => child.id === focusedGraphParentId);
        if (!prevFocusedParent) {
          return typeof value === 'function' ? value(prev) : value;
        }

        const prevChildren = prevFocusedParent.children;
        const children = typeof value === 'function' ? value(prevChildren) : value;
        return prev.map((child) => (child.id === focusedGraphParentId ? { ...child, children } : child));
      });
      const updated = typeof value === 'function' ? value(focusedGraphChildren) : value;
      if (updated.length !== focusedGraphChildren.length) {
        setFocusedGraphChildId('');
      }
    },
    [focusedGraphChildren, focusedGraphParentId, setFocusedGraphChildId, setGraphRootChildren],
  );

  return { focusedGraphParent, focusedGraphChildren, setFocusedGraphChildren };
}
