'use client';
import { useInitProject, useLoadableProject } from '@/contexts/projects';

import ProjectTopViewComponent from './ProjectTopView';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectTopViewProps = {
  readonly user: Claims;
  readonly projectId: string;
};

const ProjectTopView: React.FC<ProjectTopViewProps> = ({ user, projectId }) => {
  const loadableProject = useLoadableProject();
  useInitProject({ id: user.sub }, projectId);

  return <ProjectTopViewComponent loadableProject={loadableProject} />;
};

export default ProjectTopView;
