'use client';
import { useCreateProjectInList } from '@/contexts/openapi/projects';

import ProjectToolbarComponent from './ProjectToolbar';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectToolbarProps = {
  readonly user: Claims;
};

const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ user }) => {
  const createProject = useCreateProjectInList({ id: user.sub });
  return <ProjectToolbarComponent onCreateProject={createProject} />;
};

export default ProjectToolbar;
