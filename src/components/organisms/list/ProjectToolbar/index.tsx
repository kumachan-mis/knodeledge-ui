'use client';
import { useCreateProject } from '@/contexts/projects';

import ProjectToolbarComponent from './ProjectToolbar';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectToolbarProps = {
  readonly user: Claims;
};

const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ user }) => {
  const createProject = useCreateProject({ id: user.sub });
  return <ProjectToolbarComponent onCreateProject={createProject} />;
};

export default ProjectToolbar;
