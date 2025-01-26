'use client';
import AppGraphChildInspector from '../AppGraphChildInspector';
import StarGraph, { StarGraphProps } from '@/components/libs/StarGraph';
import { useFocusedStarGraphChild } from '@/components/libs/StarGraph/hooks';

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
  const { focusedGraphChild, setFocusedGraphChild } = useFocusedStarGraphChild(props);

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
