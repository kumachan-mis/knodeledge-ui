import { ProjectListContextProvider } from '@/contexts/projects';

import ProjectListPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();
  return (
    session?.user && (
      <ProjectListContextProvider>
        <ProjectListPageClient user={session.user} />
      </ProjectListContextProvider>
    )
  );
};

export default ProjectListPage;
