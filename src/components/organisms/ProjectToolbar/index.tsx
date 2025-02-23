'use client';
import { useCreateProjectInList } from '@/contexts/openapi/projects';

import ProjectToolbarComponent from './ProjectToolbar';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectToolbarProps = {
  readonly user: User;
};

const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ user }) => {
  const createProject = useCreateProjectInList({ id: user.sub });
  return <ProjectToolbarComponent onCreateProject={createProject} />;
};

export default ProjectToolbar;
