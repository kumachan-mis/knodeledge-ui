import { StarGraphChildWithId } from './context';
import { UseFocusedGraphReturn } from './focusedGraphChildren.hooks';

import React from 'react';

export type UseFocusedGraphChildProps = UseFocusedGraphReturn & {
  readonly focusedGraphChildId: string;
};

export type UseFocusedGraphChildReturn = {
  readonly focusedGraphChild: StarGraphChildWithId | null;
  readonly setFocusedGraphChild: React.Dispatch<React.SetStateAction<StarGraphChildWithId>>;
};

export function useFocusedGraphChild({
  focusedGraphChildId,
  focusedGraphChildren,
  setFocusedGraphChildren,
}: UseFocusedGraphChildProps): UseFocusedGraphChildReturn {
  const focusedGraphChild = focusedGraphChildren.find((child) => child.id === focusedGraphChildId) ?? null;

  const setFocusedGraphChild = React.useCallback(
    (value: React.SetStateAction<StarGraphChildWithId>) => {
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
