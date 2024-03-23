'use client';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import ProjectDialogFormComponent, { ProjectFieldValues } from './ProjectDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export type ProjectDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
  readonly onClose: () => void;
};

const ProjectDialogComponent: React.FC<ProjectDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ProjectDialogFormComponent {...rest} />
  </Dialog>
);

export default ProjectDialogComponent;
