import { LoadableProject } from '@/contexts/projects';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export type ProjectTopViewProps = {
  loadableProject: LoadableProject;
};

const ProjectTopViewComponent: React.FC<ProjectTopViewProps> = ({ loadableProject }) => (
  <Container maxWidth="sm">
    {loadableProject.state === 'loading' ? (
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
      </>
    )}
  </Container>
);

export default ProjectTopViewComponent;
