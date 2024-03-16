import { Typography } from '@mui/material';
import React from 'react';

export type ProjectTitleComponentProps = {
  readonly children?: React.ReactNode;
};

const ProjectTitleComponent: React.FC<ProjectTitleComponentProps> = ({ children }) => (
  <Typography variant="h4">{children}</Typography>
);

export default ProjectTitleComponent;
