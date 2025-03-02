'use client';
import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { ProjectWithoutAutofield } from '@/openapi';

import ProjectFormDialogFormComponent, { ProjectFieldValidates, ProjectFieldValues } from './ProjectFormDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ProjectFormDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly validates?: ProjectFieldValidates;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectFormDialogComponent: React.FC<ProjectFormDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ProjectFormDialogFormComponent {...rest} />
  </Dialog>
);

export default ProjectFormDialogComponent;
