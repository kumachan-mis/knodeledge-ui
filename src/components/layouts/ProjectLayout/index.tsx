import ProjectLayoutComponent from './ProjectLayout';

import { getSession } from '@auth0/nextjs-auth0';

export type ProjectLayoutProps = {
  readonly children?: React.ReactNode;
};

const ProjectLayout: React.FC<ProjectLayoutProps> = async ({ children }) => {
  const session = await getSession();

  return session?.user && <ProjectLayoutComponent user={session.user}>{children}</ProjectLayoutComponent>;
};

export default ProjectLayout;
