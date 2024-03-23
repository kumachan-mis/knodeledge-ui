import { LoadableAction } from '@/contexts/openapi';
import { LoadableProjectListItem } from '@/contexts/projects';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import ProjectCardComponent from './ProjectCard';

import React from 'react';

type ProjectCardProps = {
  readonly loadableProject: LoadableProjectListItem;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => <ProjectCardComponent {...props} />;

export default ProjectCard;
