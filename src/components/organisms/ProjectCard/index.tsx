import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { ProjectWithoutAutofield, Project } from '@/openapi';

import ProjectCardComponent from './ProjectCard';

export type ProjectCardProps = {
  readonly project: Project;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onDeleteProject: () => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => <ProjectCardComponent {...props} />;

export default ProjectCard;
