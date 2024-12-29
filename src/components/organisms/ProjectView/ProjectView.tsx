import ProjectDialog from '@/components/organisms/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { Project, ProjectWithoutAutofield } from '@/openapi';

import EditNoteIcon from '@mui/icons-material/EditNote';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export type ProjectViewComponentProps = {
  readonly project: Project;
  readonly onUpdateProject: (
    id: string,
    project: ProjectWithoutAutofield,
  ) => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectViewComponent: React.FC<ProjectViewComponentProps> = ({ project, onUpdateProject }) => {
  const {
    open: openUpdateProjectDialog,
    onOpen: onOpenUpdateProjectDialog,
    onClose: onCloseUpdateProjectDialog,
  } = useDialog();

  return (
    <Container maxWidth="sm">
      <Typography sx={{ my: 6 }} textAlign="center" variant="h3">
        {project.name}
      </Typography>
      <Typography sx={{ my: 12 }} variant="body1">
        {project.description}
      </Typography>
      <Box display="flex" justifyContent="center" my={6}>
        <Button onClick={onOpenUpdateProjectDialog} startIcon={<EditNoteIcon />} variant="contained">
          Update Project
        </Button>
      </Box>
      <ProjectDialog
        defaultValues={{ name: project.name, description: project.description ?? '' }}
        onClose={onCloseUpdateProjectDialog}
        onSubmit={(updatedProject) => onUpdateProject(project.id, updatedProject)}
        open={openUpdateProjectDialog}
        submitText="Save Changes"
        title="Update Project"
      />
    </Container>
  );
};

export default ProjectViewComponent;
