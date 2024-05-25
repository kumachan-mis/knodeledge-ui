import UnauthorizedError from '@/components/organisms/UnauthorizedError';

import ProjectListPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return <ProjectListPageClient user={session.user} />;
};

export default ProjectListPage;
