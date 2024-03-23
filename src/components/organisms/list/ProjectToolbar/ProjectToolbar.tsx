'use client';
import ProjectDialog from '../../dialog/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { useDialog } from '@/hooks/dialog';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

export type ProjectToolbarComponentProps = {
  readonly onCreateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
};

const ProjectToolbarComponent: React.FC<ProjectToolbarComponentProps> = ({ onCreateProject }) => {
  const { open: openNewProjectDialog, onOpen: onOpenNewProjectDialog, onClose: onCloseNewProjectDialog } = useDialog();

  return (
    <Toolbar sx={{ my: 1 }}>
      <Button onClick={onOpenNewProjectDialog} variant="contained">
        New Project
      </Button>
      <ProjectDialog
        defaultValues={{ name: '', description: '' }}
        onClose={onCloseNewProjectDialog}
        onSubmit={onCreateProject}
        open={openNewProjectDialog}
        submitText="Create Project"
        title="New Project"
      />
    </Toolbar>
  );
};

export default ProjectToolbarComponent;
