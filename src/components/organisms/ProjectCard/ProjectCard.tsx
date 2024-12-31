'use client';
import ProjectDialog from '@/components/organisms/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { Project, ProjectWithoutAutofield } from '@/openapi';
import { PROJECTS_ID_PATH_NAME } from '@/utils/page';

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
};

const ProjectCardComponent: React.FC<ProjectCardComponentProps> = ({ project, onUpdateProject }) => {
  const {
    open: openUpdateProjectDialog,
    onOpen: onOpenUpdateProjectDialog,
    onClose: onCloseUpdateProjectDialog,
  } = useDialog();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea LinkComponent={Link} href={`/${PROJECTS_ID_PATH_NAME}/${project.id}`}>
        <CardContent>
          <Tooltip title={project.name}>
            <Typography color="text.primary" component="div" gutterBottom noWrap variant="h6">
              {project.name}
            </Typography>
          </Tooltip>
          <Typography color="text.secondary" flexGrow={1} minHeight="120px" textAlign="justify" variant="body2">
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="update project" onClick={onOpenUpdateProjectDialog} size="small">
          <EditNoteIcon />
        </IconButton>
        <ProjectDialog
          defaultValues={{ name: project.name, description: project.description ?? '' }}
          onClose={onCloseUpdateProjectDialog}
          onSubmit={onUpdateProject}
          open={openUpdateProjectDialog}
          submitText="Save Changes"
          title="Update Project"
        />
      </CardActions>
    </Card>
  );
};

export default ProjectCardComponent;
