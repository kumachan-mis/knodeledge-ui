import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

export type AppMainProps = {
  readonly children: React.ReactNode;
};

const AppMain: React.FC<AppMainProps> = ({ children }) => (
  <Box component="main" sx={{ width: '100%' }}>
    <Toolbar variant="dense" />
    {children}
  </Box>
);

export default AppMain;
