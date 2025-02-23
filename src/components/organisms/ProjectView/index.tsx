'use client';
import { useLoadableProject, useUpdateProject } from '@/contexts/openapi/projects';

import ProjectViewComponent from './ProjectView';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectViewProps = {
  readonly user: User;
};

const ProjectView: React.FC<ProjectViewProps> = ({ user }) => {
  const loadableProject = useLoadableProject();
  const updateProject = useUpdateProject({ id: user.sub });
  return <ProjectViewComponent onUpdateProject={updateProject} project={loadableProject.data} />;
};

export default ProjectView;
