import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { Project } from '@/openapi';

import ProjectPreviewDialogComponent from './ProjectPreviewDialog';

import { ButtonProps } from '@mui/material/Button';

export type ProjectPreviewDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly project: Project;
  readonly onSubmit: () => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectPreviewDialog: React.FC<ProjectPreviewDialogProps> = (props) => (
  <ProjectPreviewDialogComponent {...props} />
);

export default ProjectPreviewDialog;
