'use client';
import { useLoadableProject, useUpdateProject } from '@/contexts/projects';

import ProjectTopViewComponent from './ProjectTopView';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectTopViewProps = {
  readonly user: Claims;
};

const ProjectTopView: React.FC<ProjectTopViewProps> = ({ user }) => {
  const loadableProject = useLoadableProject();
  const updateProject = useUpdateProject({ id: user.sub });
  return <ProjectTopViewComponent loadableProject={loadableProject} onUpdateProject={updateProject} />;
};

export default ProjectTopView;
