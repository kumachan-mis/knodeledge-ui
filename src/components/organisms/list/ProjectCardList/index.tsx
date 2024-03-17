'use client';
import { useLoadableProjectList } from '@/contexts/projects';

import ProjectCardListComponent from './ProjectCardList';

import React from 'react';

const ProjectCardList: React.FC = () => {
  const loadableProjectList = useLoadableProjectList();
  return <ProjectCardListComponent loadableProjectList={loadableProjectList} />;
};

export default ProjectCardList;
