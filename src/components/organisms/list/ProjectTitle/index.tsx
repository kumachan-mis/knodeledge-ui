import { Typography } from '@mui/material';
import React from 'react';

const ProjectTitle: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => (
  <Typography variant="h4">{children}</Typography>
);

export default ProjectTitle;