'use client';
import ProjectPreviewDialog from '../ProjectPreviewDialog';
import ProjectFormDialog from '@/components/organisms/ProjectFormDialog';
import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { useDialog } from '@/hooks/dialog';
import { Project, ProjectWithoutAutofield } from '@/openapi';
import { PROJECTS_ID_PATH_NAME } from '@/utils/page';

import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type ProjectCardComponentProps = {
  readonly project: Project;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onDeleteProject: () => Promise<LoadableAction<ProjectActionError>>;
};

const ProjectCardComponent: React.FC<ProjectCardComponentProps> = ({ project, onUpdateProject, onDeleteProject }) => {
  const {
    open: openUpdateProjectDialog,
    onOpen: onOpenUpdateProjectDialog,
    onClose: onCloseUpdateProjectDialog,
  } = useDialog();

  const {
    open: openDeleteProjectDialog,
    onOpen: onOpenDeleteProjectDialog,
    onClose: onCloseDeleteProjectDialog,
  } = useDialog();

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea LinkComponent={Link} href={`/${PROJECTS_ID_PATH_NAME}/${project.id}`}>
        <CardContent>
          <Tooltip title={project.name}>
            <Typography color="text.primary" component="div" gutterBottom noWrap variant="h6">
              {project.name}
            </Typography>
          </Tooltip>
          <Typography
            color="text.secondary"
            sx={{ width: '100%', height: '120px', overflow: 'hidden', whiteSpace: 'pre-wrap', textAlign: 'justify' }}
            variant="body2"
          >
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="update project" onClick={onOpenUpdateProjectDialog} size="small">
          <EditNoteIcon />
        </IconButton>
        <IconButton aria-label="delete project" onClick={onOpenDeleteProjectDialog} size="small">
          <DeleteIcon />
        </IconButton>
        <ProjectFormDialog
          defaultValues={{ name: project.name, description: project.description ?? '' }}
          onClose={onCloseUpdateProjectDialog}
          onSubmit={onUpdateProject}
          open={openUpdateProjectDialog}
          submitText="Save Changes"
          title="Update Project"
        />
        <ProjectPreviewDialog
          onClose={onCloseDeleteProjectDialog}
          onSubmit={onDeleteProject}
          open={openDeleteProjectDialog}
          project={project}
          submitColor="error"
          submitText="Delete Project"
          title="Delete Project"
        />
      </CardActions>
    </Card>
  );
};

export default ProjectCardComponent;
