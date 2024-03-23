import ProjectCard from '@/components/organisms/list/ProjectCard';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProjectList } from '@/contexts/projects';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

export type ProjectCardListComponentProps = {
  readonly loadableProjectList: LoadableProjectList;
  readonly onUpdateProject: (
    id: string,
    project: ProjectWithoutAutofield,
  ) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
};

const ProjectCardListComponent: React.FC<ProjectCardListComponentProps> = ({ loadableProjectList, onUpdateProject }) =>
  loadableProjectList.state !== 'success' ? (
    <Box display="flex" justifyContent="center" p={2}>
      <CircularProgress />
    </Box>
  ) : loadableProjectList.data.length === 0 ? (
    <Box display="flex" justifyContent="center" p={2}>
      <Typography color="text.secondary" variant="h5">
        No Projects
      </Typography>
    </Box>
  ) : (
    <Grid container spacing={4}>
      {loadableProjectList.data.map((loadableProject) => (
        <Grid item key={loadableProject.data.id} md={4} sm={6} xl={3} xs={12}>
          <ProjectCard
            loadableProject={loadableProject}
            onUpdateProject={(project) => onUpdateProject(loadableProject.data.id, project)}
          />
        </Grid>
      ))}
    </Grid>
  );

export default ProjectCardListComponent;
