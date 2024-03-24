import ProjectDialog from '../../dialog/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProject, ProjectActionError } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { ProjectWithoutAutofield } from '@/openapi';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

export type ProjectTopViewProps = {
  readonly loadableProject: LoadableProject;
  readonly onUpdateProject: (
    id: string,
    project: ProjectWithoutAutofield,
  ) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectTopViewComponent: React.FC<ProjectTopViewProps> = ({ loadableProject, onUpdateProject }) => {
  const {
    open: openEditProjectDialog,
    onOpen: onOpenEditProjectDialog,
    onClose: onCloseEditProjectDialog,
  } = useDialog();

  return (
    <Container maxWidth="sm">
      {loadableProject.state !== 'success' ? (
        <Box display="flex" justifyContent="center" p={12}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography sx={{ my: 6 }} textAlign="center" variant="h3">
            {loadableProject.data.name}
          </Typography>
          <Typography sx={{ my: 12 }} variant="body1">
            {loadableProject.data.description}
          </Typography>
          <Box display="flex" justifyContent="center" my={6}>
            <Button onClick={onOpenEditProjectDialog} variant="contained">
              Update Project
            </Button>
          </Box>
          <ProjectDialog
            defaultValues={{ name: loadableProject.data.name, description: loadableProject.data.description ?? '' }}
            onClose={onCloseEditProjectDialog}
            onSubmit={(updatedProject) => onUpdateProject(loadableProject.data.id, updatedProject)}
            open={openEditProjectDialog}
            submitText="Update Project"
            title="Edit Project"
          />
        </>
      )}
    </Container>
  );
};

export default ProjectTopViewComponent;
