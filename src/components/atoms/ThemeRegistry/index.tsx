'use client';
import { theme } from '@/components/theme';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import React from 'react';

export type ThemeRegistryProps = {
  readonly children: React.ReactNode;
};

const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => (
  <AppRouterCacheProvider options={{ key: 'mui' }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default ThemeRegistry;
