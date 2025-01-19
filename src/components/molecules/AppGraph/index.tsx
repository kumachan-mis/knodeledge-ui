'use client';
import AppGraphChildInspector from '../AppGraphChildInspector';
import StarGraph, { StarGraphProps } from '@/components/libs/StarGraph';
import GraphChildWithId from '@/components/libs/StarGraph/GraphChildWithId';

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

export type AppGraphProps = StarGraphProps & {
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppGraph: React.FC<AppGraphProps> = ({ state, ...rest }) => (
  <AppGraphRoot>
    {state !== 'success' ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        {state === 'loading' && <CircularProgress />}
      </Box>
    ) : (
      <AppGraphInner {...rest} />
    )}
  </AppGraphRoot>
);

const AppGraphInner: React.FC<StarGraphProps> = ({
  graphRootChildren,
  focusedGraphChildId,
  setFocusedGraphChildren,
  ...rest
}) => {
  const focusedGraphChild = graphRootChildren.find((child) => child.id === focusedGraphChildId);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <StarGraph
        focusedGraphChildId={focusedGraphChildId}
        graphRootChildren={graphRootChildren}
        setFocusedGraphChildren={setFocusedGraphChildren}
        {...rest}
      />
      {focusedGraphChild && (
        <AppGraphChildInspector graphChild={focusedGraphChild} setGraphChild={setFocusedGraphChild} />
      )}
    </Box>
  );
};

const AppGraphRoot = styled.div({
  '&': {
    width: '100%',
    height: '100%',
  },
});

export default AppGraph;
