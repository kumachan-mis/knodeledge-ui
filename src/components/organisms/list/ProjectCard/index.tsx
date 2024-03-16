import { LoadableProjectListItem } from '@/contexts/projects';

import ProjectCardComponent from './ProjectCard';

type ProjectCardProps = {
  readonly loadableProject: LoadableProjectListItem;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ loadableProject }) => (
  <ProjectCardComponent loadableProject={loadableProject} />
);

export default ProjectCard;
