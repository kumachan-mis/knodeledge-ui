import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import React from 'react';

export type AppDrawerProps = {
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
  readonly onMobileTransitionEnd: () => void;
  readonly header?: React.ReactNode;
  readonly children?: React.ReactNode;
};

export const APP_DRAWER_WIDTH = 240;

const AppDrawer: React.FC<AppDrawerProps> = ({
  mobileOpen,
  onMobileClose,
  onMobileTransitionEnd,
  header,
  children,
}) => (
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
      {header}
      <Divider />
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
      {header}
      <Divider />
      {children}
    </Drawer>
  </Box>
);

export default AppDrawer;

export { default as useAppDrawer } from './hooks';
export type { UseAppDrawerReturn } from './hooks';
