'use client';
import { theme } from '@/components/theme';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeRegistry: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppRouterCacheProvider options={{ key: 'mui' }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default ThemeRegistry;
