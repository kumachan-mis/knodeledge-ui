import ProjectCard from '@/components/organisms/ProjectCard';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProjectList, ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield } from '@/openapi';

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
  ) => Promise<LoadableAction<ProjectActionError>>;
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
      {loadableProjectList.data.map((project) => (
        <Grid item key={project.id} md={4} sm={6} xl={3} xs={12}>
          <ProjectCard
            onUpdateProject={(updatedProject) => onUpdateProject(project.id, updatedProject)}
            project={project}
          />
        </Grid>
      ))}
    </Grid>
  );

export default ProjectCardListComponent;
