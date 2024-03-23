import ProjectDialog from '../../dialog/ProjectDialog';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProjectListItem } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

type ProjectCardComponentProps = {
  readonly loadableProject: LoadableProjectListItem;
  readonly onUpdateProject: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
};

const ProjectCardComponent: React.FC<ProjectCardComponentProps> = ({ loadableProject, onUpdateProject }) => {
  const {
    open: openEditProjectDialog,
    onOpen: onOpenEditProjectDialog,
    onClose: onCloseEditProjectDialog,
  } = useDialog();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea LinkComponent={Link} href={`/projects/${loadableProject.data.id}`}>
        <CardContent>
          <Tooltip title={loadableProject.data.name}>
            <Typography color="text.primary" component="div" gutterBottom noWrap variant="h6">
              {loadableProject.data.name}
            </Typography>
          </Tooltip>
          <Typography color="text.secondary" flexGrow={1} minHeight="120px" textAlign="justify" variant="body2">
            {loadableProject.data.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="update project" onClick={onOpenEditProjectDialog} size="small">
          <EditIcon />
        </IconButton>
        <ProjectDialog
          defaultValues={{ name: loadableProject.data.name, description: loadableProject.data.description ?? '' }}
          onClose={onCloseEditProjectDialog}
          onSubmit={onUpdateProject}
          open={openEditProjectDialog}
          submitText="Update Project"
          title="Edit Project"
        />
      </CardActions>
    </Card>
  );
};

export default ProjectCardComponent;
