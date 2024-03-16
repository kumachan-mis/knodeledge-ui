import ProjectTitleComponent from './ProjectTitle';

import React from 'react';

export type ProjectTitleProps = {
  readonly children?: React.ReactNode;
};

const ProjectTitle: React.FC<ProjectTitleProps> = ({ children }) => (
  <ProjectTitleComponent>{children}</ProjectTitleComponent>
);

export default ProjectTitle;
