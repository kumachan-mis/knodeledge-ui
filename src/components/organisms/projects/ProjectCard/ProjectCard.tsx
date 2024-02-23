import { LoadableProject } from '@/contexts/projects';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type ProjectCardComponentProps = {
  readonly loadableProject: LoadableProject;
};

const ProjectCardComponent: React.FC<ProjectCardComponentProps> = ({ loadableProject }) => (
  <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
    <CardActionArea>
      <CardContent>
        {loadableProject.state === 'loading' && (
          <CircularProgress size="30px" sx={{ position: 'absolute', top: '20px', right: '20px' }} />
        )}
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
