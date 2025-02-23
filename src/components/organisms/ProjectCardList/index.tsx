'use client';
import { useLoadableProjectList, useUpdateProjectInList } from '@/contexts/openapi/projects';

import ProjectCardListComponent from './ProjectCardList';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectCardListProps = {
  readonly user: User;
};

const ProjectCardList: React.FC<ProjectCardListProps> = ({ user }) => {
  const loadableProjectList = useLoadableProjectList();
  const updateProject = useUpdateProjectInList({ id: user.sub });
  return <ProjectCardListComponent onUpdateProject={updateProject} projectList={loadableProjectList.data} />;
};

export default ProjectCardList;
