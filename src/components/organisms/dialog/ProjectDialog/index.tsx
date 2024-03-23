import { LoadableAction } from '@/contexts/openapi';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import ProjectDialogComponent from './ProjectDialog';
import { ProjectFieldValues } from './ProjectDialogForm';

import React from 'react';

export type ProjectDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
  readonly onClose: () => void;
};

const ProjectDialog: React.FC<ProjectDialogProps> = (props) => <ProjectDialogComponent {...props} />;

export default ProjectDialog;
