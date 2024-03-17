import UnauthorizedError from '@/components/organisms/error/UnauthorizedError';
import { ProjectContextProvider } from '@/contexts/projects';

import ProjectDetailPageClient, { ProjectDetailPageClientProps } from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectDetailPage: NextPage<ProjectDetailPageClientProps> = async (props) => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return (
    <ProjectContextProvider>
      <ProjectDetailPageClient user={session.user} {...props} />
    </ProjectContextProvider>
  );
};

export default ProjectDetailPage;
