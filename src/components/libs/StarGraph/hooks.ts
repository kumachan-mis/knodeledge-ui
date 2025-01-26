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

export type UseFocusedStarGraphChildrenReturn = {
  readonly focusedGraphParent: GraphRootWithId;
  readonly focusedGraphChildren: GraphChildWithId[];
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<GraphChildWithId[]>>;
};

export type UseFocusedStarGraphChildReturn = {
  readonly focusedGraphChild: GraphChildWithId | null;
  readonly setFocusedGraphChild: React.Dispatch<React.SetStateAction<GraphChildWithId>>;
};

export function useStarGraph({ setGraphContent, graphRoot, graphContent }: UseStarGraphProps): StarGraphProps {
  const setGraphRootChildren = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId[]>) => {
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

export function useFocusedStarGraphChildren({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  setGraphRootChildren,
  setFocusedGraphChildId,
}: StarGraphProps): UseFocusedStarGraphChildrenReturn {
  const graphParent = graphRootChildren.find((child) => child.id === focusedGraphParentId);

  const focusedGraphParent = graphParent ?? graphRoot;
  const focusedGraphChildren = graphParent?.children ?? graphRootChildren;

  const setFocusedGraphChildren = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId[]>) => {
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

export function useFocusedStarGraphChild({
  focusedGraphChildId,
  ...rest
}: StarGraphProps): UseFocusedStarGraphChildReturn {
  const { focusedGraphChildren, setFocusedGraphChildren } = useFocusedStarGraphChildren({
    focusedGraphChildId,
    ...rest,
  });

  const focusedGraphChild = focusedGraphChildren.find((child) => child.id === focusedGraphChildId) ?? null;

  const setFocusedGraphChild = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId>) => {
      setFocusedGraphChildren((prev) => {
        const prevFocusedGraphChild = prev.find((child) => child.id === focusedGraphChildId);
        if (!prevFocusedGraphChild) return prev;
        const updated = typeof value === 'function' ? value(prevFocusedGraphChild) : value;
        return prev.map((child) => (child.id === focusedGraphChildId ? updated : child));
      });
    },
    [focusedGraphChildId, setFocusedGraphChildren],
  );

  return { focusedGraphChild, setFocusedGraphChild };
}
