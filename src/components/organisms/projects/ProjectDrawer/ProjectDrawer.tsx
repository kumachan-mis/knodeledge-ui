import { PROJECT_DRAWER_WIDTH } from './constants';

import { Claims } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

export type ProjectDrawerComponentProps = {
  readonly user: Claims;
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
  readonly onMobileTransitionEnd: () => void;
};

const ProjectDrawerComponent: React.FC<ProjectDrawerComponentProps> = ({
  mobileOpen,
  onMobileClose,
  onMobileTransitionEnd,
}) => (
  <Box component="nav" sx={{ width: { sm: PROJECT_DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
    <Drawer
      // Better open performance on mobile
      ModalProps={{ keepMounted: true }}
      onClose={onMobileClose}
      onTransitionEnd={onMobileTransitionEnd}
      open={mobileOpen}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: PROJECT_DRAWER_WIDTH },
      }}
      variant="temporary"
    >
      <Toolbar variant="dense" />
      <ProjectDrawerContent />
    </Drawer>
    <Drawer
      open
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: PROJECT_DRAWER_WIDTH },
      }}
      variant="permanent"
    >
      <Toolbar variant="dense" />
      <ProjectDrawerContent />
    </Drawer>
  </Box>
);

const ProjectDrawerContent: React.FC = () => <div>Project Drawer Content</div>;

export default ProjectDrawerComponent;
