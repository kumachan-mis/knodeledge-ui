'use client';
import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { Project } from '@/openapi';

import ProjectPreviewDialogFormComponent from './ProjectPreviewDialogForm';

import { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ProjectPreviewDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly project: Project;
  readonly onSubmit: () => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectPreviewDialogComponent: React.FC<ProjectPreviewDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ProjectPreviewDialogFormComponent {...rest} />
  </Dialog>
);

export default ProjectPreviewDialogComponent;
