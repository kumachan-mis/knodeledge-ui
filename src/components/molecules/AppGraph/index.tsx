'use client';
import AppGraphChildInspector from '../AppGraphChildInspector';
import StarGraph, { StarGraphProps } from '@/components/libs/StarGraph';
import { useFocusedGraphChild } from '@/components/libs/StarGraph/focusedGraphChild.hooks';
import { useFocusedGraph } from '@/components/libs/StarGraph/focusedGraph.hooks';

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

const AppGraphInner: React.FC<StarGraphProps> = (props) => {
  const focusedGraph = useFocusedGraph(props);
  const { focusedGraphChildId } = props;

  const { focusedGraphChild, setFocusedGraphChild } = useFocusedGraphChild({ ...focusedGraph, focusedGraphChildId });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <StarGraph {...props} />
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
