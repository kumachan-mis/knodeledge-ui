import UnauthorizedError from '@/components/organisms/error/UnauthorizedError';
import { ProjectListContextProvider } from '@/contexts/projects';

import ProjectListPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return (
    <ProjectListContextProvider>
      <ProjectListPageClient user={session.user} />
    </ProjectListContextProvider>
  );
};

export default ProjectListPage;
