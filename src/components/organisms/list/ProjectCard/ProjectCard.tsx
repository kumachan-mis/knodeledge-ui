import { LoadableProjectListItem } from '@/contexts/projects';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

type ProjectCardComponentProps = {
  readonly loadableProject: LoadableProjectListItem;
};

const ProjectCardComponent: React.FC<ProjectCardComponentProps> = ({ loadableProject }) => (
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
  </Card>
);

export default ProjectCardComponent;
