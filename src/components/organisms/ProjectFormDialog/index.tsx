import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { ProjectWithoutAutofield } from '@/openapi';

import ProjectFormDialogComponent from './ProjectFormDialog';
import { ProjectFieldValidates, ProjectFieldValues } from './ProjectFormDialogForm';

export type ProjectFormDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly validates?: ProjectFieldValidates;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = (props) => <ProjectFormDialogComponent {...props} />;

export default ProjectFormDialog;
