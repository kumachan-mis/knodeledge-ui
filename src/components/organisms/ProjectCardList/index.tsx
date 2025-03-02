'use client';
import { useDeleteProjectInList, useLoadableProjectList, useUpdateProjectInList } from '@/contexts/openapi/projects';

import ProjectCardListComponent from './ProjectCardList';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectCardListProps = {
  readonly user: User;
};

const ProjectCardList: React.FC<ProjectCardListProps> = ({ user }) => {
  const loadableProjectList = useLoadableProjectList();
  const updateProject = useUpdateProjectInList({ id: user.sub });
  const deleteProject = useDeleteProjectInList({ id: user.sub });
  return (
    <ProjectCardListComponent
      onDeleteProject={deleteProject}
      onUpdateProject={updateProject}
      projectList={loadableProjectList.data}
    />
  );
};

export default ProjectCardList;
