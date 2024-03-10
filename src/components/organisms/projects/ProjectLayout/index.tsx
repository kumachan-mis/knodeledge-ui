import ProjectLayoutComponent from './ProjectLayout';

import { getSession } from '@auth0/nextjs-auth0';

const ProjectLayout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await getSession();

  return session?.user && <ProjectLayoutComponent user={session.user}>{children}</ProjectLayoutComponent>;
};

export default ProjectLayout;
