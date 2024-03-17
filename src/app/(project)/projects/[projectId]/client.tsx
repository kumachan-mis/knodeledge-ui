'use client';
import NotFoundError from '@/components/organisms/error/NotFoundError';
import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { useInitProject, useLoadableProject } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import { NextPage } from 'next';

export type ProjectDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPageClient: NextPage<AuthorizedPageProps<ProjectDetailPageClientProps>> = ({ user, params }) => {
  useInitProject({ id: user.sub }, params.projectId);
  const loadableProject = useLoadableProject();

  if (loadableProject.state === 'notfound') {
    return <NotFoundError />;
  }

  return <ProjectTopView />;
};

export default ProjectDetailPageClient;
