import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = ({ params }) => {
  return (
    <Container component="main" maxWidth="lg" sx={{ my: 6 }}>
      <Typography>{`Project ID: ${params.projectId}`}</Typography>
    </Container>
  );
};

export default ProjectDetailPage;
