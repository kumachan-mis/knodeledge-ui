import { Claims } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

export type AppDrawerProps = {
  readonly user: Claims;
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
  readonly onMobileTransitionEnd: () => void;
  readonly children?: React.ReactNode;
};

export const APP_DRAWER_WIDTH = 240;

const AppDrawer: React.FC<AppDrawerProps> = ({ mobileOpen, onMobileClose, onMobileTransitionEnd, children }) => (
  <Box component="nav" sx={{ width: { md: APP_DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
    <Drawer
      // Better open performance on mobile
      ModalProps={{ keepMounted: true }}
      onClose={onMobileClose}
      onTransitionEnd={onMobileTransitionEnd}
      open={mobileOpen}
      sx={{
        display: { xs: 'block', sm: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: APP_DRAWER_WIDTH },
      }}
      variant="temporary"
    >
      <Toolbar variant="dense" />
      {children}
    </Drawer>
    <Drawer
      open
      sx={{
        display: { xs: 'none', sm: 'none', md: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: APP_DRAWER_WIDTH },
      }}
      variant="permanent"
    >
      <Toolbar variant="dense" />
      {children}
    </Drawer>
  </Box>
);

export default AppDrawer;

export { default as useAppDrawer } from './hooks';
export type { UseAppDrawerReturn } from './hooks';
