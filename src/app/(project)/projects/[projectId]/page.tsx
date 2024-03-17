import { ProjectContextProvider } from '@/contexts/projects';

import ProjectDetailPageClient, { ProjectDetailPageClientProps } from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectDetailPage: NextPage<ProjectDetailPageClientProps> = async (props) => {
  const session = await getSession();
  return (
    session?.user && (
      <ProjectContextProvider>
        <ProjectDetailPageClient user={session.user} {...props} />
      </ProjectContextProvider>
    )
  );
};

export default ProjectDetailPage;
