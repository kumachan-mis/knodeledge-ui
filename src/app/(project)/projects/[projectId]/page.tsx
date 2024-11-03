import UnauthorizedError from '@/components/organisms/UnauthorizedError';

import ProjectDetailPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async (props) => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return <ProjectDetailPageClient user={session.user} {...props} />;
};

export default ProjectDetailPage;
