import UnauthorizedError from '@/components/organisms/UnauthorizedError';

import ProjectDetailPageClient, { ProjectDetailPageClientProps } from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectDetailPage: NextPage<ProjectDetailPageClientProps> = async (props) => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return <ProjectDetailPageClient user={session.user} {...props} />;
};

export default ProjectDetailPage;
