import Typography from '@mui/material/Typography';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = ({ params }) => {
  return <Typography>{`Project ID: ${params.projectId}`}</Typography>;
};

export default ProjectDetailPage;
