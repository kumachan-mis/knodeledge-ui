import { LoadableProject } from '@/contexts/projects';

import Typography from '@mui/material/Typography';
import React from 'react';

export type ProjectDrawerHeaderComponentProps = {
  readonly loadableProject: LoadableProject;
};

const ProjectDrawerHeaderComponent: React.FC<ProjectDrawerHeaderComponentProps> = ({ loadableProject }) => {
  return (
    <Typography fontWeight="bold" noWrap variant="subtitle1">
      {loadableProject.state === 'success' ? loadableProject.data.name : ''}
    </Typography>
  );
};

export default ProjectDrawerHeaderComponent;
