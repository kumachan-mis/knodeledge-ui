'use client';
import ProjectFormDialog from '@/components/organisms/ProjectFormDialog';
import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { useDialog } from '@/hooks/dialog';
import { ProjectWithoutAutofield } from '@/openapi';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

export type ProjectToolbarComponentProps = {
  readonly onCreateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectToolbarComponent: React.FC<ProjectToolbarComponentProps> = ({ onCreateProject }) => {
  const { open: openNewProjectDialog, onOpen: onOpenNewProjectDialog, onClose: onCloseNewProjectDialog } = useDialog();

  return (
    <Toolbar sx={{ my: 1 }}>
      <Button onClick={onOpenNewProjectDialog} startIcon={<NoteAddIcon />} variant="contained">
        New Project
      </Button>
      <ProjectFormDialog
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
