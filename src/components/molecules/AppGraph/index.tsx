'use client';
import { GraphChild } from '@/openapi/models/GraphChild';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import React from 'react';

export type AppGraphProps = {
  readonly graphParent: string;
  readonly graphChildren: GraphChild[];
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppGraph: React.FC<AppGraphProps> = ({ state }) => {
  return (
    <AppGraphRoot>
      {state !== 'success' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {state === 'loading' && <CircularProgress />}
        </Box>
      )}
    </AppGraphRoot>
  );
};

const AppGraphRoot = styled('div')({
  '&&': {
    width: '100%',
    height: '70%',
  },
});

export default AppGraph;
