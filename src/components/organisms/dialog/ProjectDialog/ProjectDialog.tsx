'use client';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield } from '@/openapi';

import ProjectDialogFormComponent, { ProjectFieldValues } from './ProjectDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export type ProjectDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectDialogComponent: React.FC<ProjectDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ProjectDialogFormComponent {...rest} />
  </Dialog>
);

export default ProjectDialogComponent;
