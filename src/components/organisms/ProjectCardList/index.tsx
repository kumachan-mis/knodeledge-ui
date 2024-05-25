'use client';
import { useLoadableProjectList, useUpdateProjectInList } from '@/contexts/projects';

import ProjectCardListComponent from './ProjectCardList';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectCardListProps = {
  readonly user: Claims;
};

const ProjectCardList: React.FC<ProjectCardListProps> = ({ user }) => {
  const loadableProjectList = useLoadableProjectList();
  const updateProject = useUpdateProjectInList({ id: user.sub });
  return <ProjectCardListComponent loadableProjectList={loadableProjectList} onUpdateProject={updateProject} />;
};

export default ProjectCardList;
