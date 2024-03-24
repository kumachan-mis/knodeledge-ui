import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield, Project } from '@/openapi';

import ProjectCardComponent from './ProjectCard';

import React from 'react';

type ProjectCardProps = {
  readonly project: Project;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => <ProjectCardComponent {...props} />;

export default ProjectCard;
