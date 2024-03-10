'use client';
import { useInitProjectList, useLoadableProjectList } from '@/contexts/projects';

import ProjectCardListComponent from './ProjectCardList';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectCardListProps = {
  readonly user: Claims;
};

const ProjectCardList: React.FC<ProjectCardListProps> = ({ user }) => {
  const loadableProjectList = useLoadableProjectList();
  useInitProjectList({ id: user.sub });

  return <ProjectCardListComponent loadableProjectList={loadableProjectList} />;
};

export default ProjectCardList;
