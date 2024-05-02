'use client';
import { useCreateChapterInList } from '@/contexts/chapters';
import { useLoadableProject } from '@/contexts/projects';

import ProjectDrawerHeaderComponent from './ProjectDrawerHeader';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectDrawerHeaderProps = {
  readonly user: Claims;
};

const ProjectDrawerHeader: React.FC<ProjectDrawerHeaderProps> = ({ user }) => {
  const loadableProject = useLoadableProject();
  const createChapter = useCreateChapterInList({ id: user.sub }, { id: loadableProject.data?.id ?? '' });
  return <ProjectDrawerHeaderComponent loadableProject={loadableProject} onCreateChapter={createChapter} />;
};

export default ProjectDrawerHeader;
