import { auth0 } from '@/libs/auth0';

import ProjectLayoutComponent from './ProjectLayout';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectLayoutProps = {
  readonly projectId: string;
  readonly DrawerHeader?: React.FC<{
    readonly user: User;
    readonly projectId: string;
  }>;
  readonly DrawerContent?: React.FC<{
    readonly user: User;
    readonly projectId: string;
  }>;
  readonly children?: React.ReactNode;
};

const ProjectLayout: React.FC<ProjectLayoutProps> = async (props) => {
  const session = await auth0.getSession();
  return <ProjectLayoutComponent {...props} user={session?.user} />;
};

export default ProjectLayout;
