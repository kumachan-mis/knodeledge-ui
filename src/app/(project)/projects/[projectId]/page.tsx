import UnauthorizedError from '@/components/organisms/UnauthorizedError';

import ProjectDetailPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: Promise<{
    readonly projectId: string;
  }>;
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async ({ params }) => {
  const session = await getSession();
  if (!session) {
    return <UnauthorizedError />;
  }

  return <ProjectDetailPageClient params={await params} user={session.user} />;
};

export default ProjectDetailPage;
