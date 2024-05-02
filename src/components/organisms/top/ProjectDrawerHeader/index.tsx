'use client';
import { useLoadableProject } from '@/contexts/projects';

import ProjectDrawerHeaderComponent from './ProjectDrawerHeader';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectDrawerHeaderProps = {
  readonly user: Claims;
};

const ProjectDrawerHeader: React.FC<ProjectDrawerHeaderProps> = () => {
  const loadableProject = useLoadableProject();
  return <ProjectDrawerHeaderComponent loadableProject={loadableProject} />;
};

export default ProjectDrawerHeader;
