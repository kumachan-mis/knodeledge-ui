'use client';
import AppHeader from '@/components/organisms/app/AppHeader';
import ProjectDrawer, {
  ProjectDrawerMenu,
  useProjectDrawer,
  PROJECT_DRAWER_WIDTH,
} from '@/components/organisms/projects/ProjectDrawer';

import { Claims } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export type ProjectLayoutComponentProps = {
  readonly user: Claims;
  readonly children: React.ReactNode;
};

const ProjectLayoutComponent: React.FC<ProjectLayoutComponentProps> = ({ user, children }) => {
  const { mobileOpen, handleMobileClose, handleMobileToggle, handleMobileTransitionEnd } = useProjectDrawer();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppHeader
        AppHeaderMenu={() => <ProjectDrawerMenu onMobileToggle={handleMobileToggle} />}
        sx={{ width: { sm: `calc(100% - ${PROJECT_DRAWER_WIDTH}px)` }, ml: { sm: `${PROJECT_DRAWER_WIDTH}px` } }}
        user={user}
      />
      <Box component="nav" sx={{ width: { sm: PROJECT_DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <ProjectDrawer
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
          onMobileTransitionEnd={handleMobileTransitionEnd}
          user={user}
        />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${PROJECT_DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default ProjectLayoutComponent;
