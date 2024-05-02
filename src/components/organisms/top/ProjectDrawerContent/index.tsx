'use client';
import { useLoadableChapterList } from '@/contexts/chapters';

import ProjectDrawerContentComponent from './ProjectDrawerContent';

import React from 'react';

const ProjectDrawerContent: React.FC = () => {
  const loadableChapterList = useLoadableChapterList();
  return <ProjectDrawerContentComponent loadableChapterList={loadableChapterList} />;
};

export default ProjectDrawerContent;
