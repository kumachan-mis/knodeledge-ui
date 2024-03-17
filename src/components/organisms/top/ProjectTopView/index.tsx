'use client';
import { useLoadableProject } from '@/contexts/projects';

import ProjectTopViewComponent from './ProjectTopView';

import React from 'react';

const ProjectTopView: React.FC = () => {
  const loadableProject = useLoadableProject();
  return <ProjectTopViewComponent loadableProject={loadableProject} />;
};

export default ProjectTopView;
