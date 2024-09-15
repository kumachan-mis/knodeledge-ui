import ProjectTitleComponent from './ProjectTitle';

export type ProjectTitleProps = {
  readonly children?: React.ReactNode;
};

const ProjectTitle: React.FC<ProjectTitleProps> = ({ children }) => (
  <ProjectTitleComponent>{children}</ProjectTitleComponent>
);

export default ProjectTitle;
