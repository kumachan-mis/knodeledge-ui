import ProjectCard from '@/components/organisms/projects/ProjectCard';
import { LoadableProjectList } from '@/contexts/projects';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export type ProjectCardListComponentProps = {
  readonly loadableProjectList: LoadableProjectList;
};

const ProjectCardListComponent: React.FC<ProjectCardListComponentProps> = ({ loadableProjectList }) =>
  loadableProjectList.state === 'loading' ? (
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
          <ProjectCard loadableProject={loadableProject} />
        </Grid>
      ))}
    </Grid>
  );

export default ProjectCardListComponent;
