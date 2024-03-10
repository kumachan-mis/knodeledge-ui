import { Project } from '@/openapi';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export type ProjectTopViewProps = {
  project: Project;
};

const ProjectTopViewComponent: React.FC<ProjectTopViewProps> = ({ project }) => (
  <Container maxWidth="sm">
    <Typography sx={{ my: 6 }} textAlign="center" variant="h3">
      {project.name}
    </Typography>
    <Typography sx={{ my: 12 }} variant="body1">
      {project.description}
    </Typography>
  </Container>
);

export default ProjectTopViewComponent;
