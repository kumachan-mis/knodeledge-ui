import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

const AppHeaderComponent: React.FC = () => (
  <AppBar>
    <Toolbar>
      <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
        <HomeIcon />
      </IconButton>
      <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
        kNODEledge
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
);

export default AppHeaderComponent;
