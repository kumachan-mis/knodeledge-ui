import ProjectLayoutComponent from './ProjectLayout';

import { Claims, getSession } from '@auth0/nextjs-auth0';

export type ProjectLayoutProps = {
  readonly projectId: string;
  readonly DrawerHeader?: React.FC<{
    readonly user: Claims;
    readonly projectId: string;
  }>;
  readonly DrawerContent?: React.FC<{
    readonly user: Claims;
    readonly projectId: string;
  }>;
  readonly children?: React.ReactNode;
};

const ProjectLayout: React.FC<ProjectLayoutProps> = async (props) => {
  const session = await getSession();
  return <ProjectLayoutComponent {...props} user={session?.user} />;
};

export default ProjectLayout;
