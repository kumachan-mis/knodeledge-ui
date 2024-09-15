import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield, Project } from '@/openapi';

import ProjectCardComponent from './ProjectCard';

export type ProjectCardProps = {
  readonly project: Project;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => <ProjectCardComponent {...props} />;

export default ProjectCard;
