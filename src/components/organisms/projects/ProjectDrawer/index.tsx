import ProjectDrawerComponent from './ProjectDrawer';
import ProjectDrawerMenu from './ProjectDrawerMenu';
import useProjectDrawer from './hooks';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectDrawerProps = {
  readonly user: Claims;
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
  readonly onMobileTransitionEnd: () => void;
};

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ user, ...rest }) => {
  return <ProjectDrawerComponent user={user} {...rest} />;
};

export default ProjectDrawer;

export { ProjectDrawerMenu, useProjectDrawer };

export { PROJECT_DRAWER_WIDTH } from './constants';
