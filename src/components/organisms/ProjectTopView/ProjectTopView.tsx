import ProjectDialog from '@/components/organisms/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProject, ProjectActionError } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { ProjectWithoutAutofield } from '@/openapi';

import EditNoteIcon from '@mui/icons-material/EditNote';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

export type ProjectTopViewComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly onUpdateProject: (
    id: string,
    project: ProjectWithoutAutofield,
  ) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectTopViewComponent: React.FC<ProjectTopViewComponentProps> = ({ loadableProject, onUpdateProject }) => {
  const {
    open: openUpdateProjectDialog,
    onOpen: onOpenUpdateProjectDialog,
    onClose: onCloseUpdateProjectDialog,
  } = useDialog();

  return loadableProject.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : (
    loadableProject.state === 'success' && (
      <Container maxWidth="sm">
        <Typography sx={{ my: 6 }} textAlign="center" variant="h3">
          {loadableProject.data.name}
        </Typography>
        <Typography sx={{ my: 12 }} variant="body1">
          {loadableProject.data.description}
        </Typography>
        <Box display="flex" justifyContent="center" my={6}>
          <Button onClick={onOpenUpdateProjectDialog} startIcon={<EditNoteIcon />} variant="contained">
            Update Project
          </Button>
        </Box>
        <ProjectDialog
          defaultValues={{ name: loadableProject.data.name, description: loadableProject.data.description ?? '' }}
          onClose={onCloseUpdateProjectDialog}
          onSubmit={(updatedProject) => onUpdateProject(loadableProject.data.id, updatedProject)}
          open={openUpdateProjectDialog}
          submitText="Save Changes"
          title="Update Project"
        />
      </Container>
    )
  );
};

export default ProjectTopViewComponent;
