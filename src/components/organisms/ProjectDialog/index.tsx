import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield } from '@/openapi';

import ProjectDialogComponent from './ProjectDialog';
import { ProjectFieldValidates, ProjectFieldValues } from './ProjectDialogForm';

export type ProjectDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly validates?: ProjectFieldValidates;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectDialog: React.FC<ProjectDialogProps> = (props) => <ProjectDialogComponent {...props} />;

export default ProjectDialog;
