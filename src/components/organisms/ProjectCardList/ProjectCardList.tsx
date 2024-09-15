import ProjectCard from '@/components/organisms/ProjectCard';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProjectList, ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield } from '@/openapi';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

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
        <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
          <ProjectCard
            onUpdateProject={(updatedProject) => onUpdateProject(project.id, updatedProject)}
            project={project}
          />
        </Grid>
      ))}
    </Grid>
  );

export default ProjectCardListComponent;
