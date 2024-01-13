import { Claims } from '@auth0/nextjs-auth0';
import HomeIcon from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

type AppHeaderComponentProps = {
  user: Claims | undefined;
};

const AppHeaderComponent: React.FC<AppHeaderComponentProps> = ({ user }) => (
  <AppBar>
    <Toolbar>
      <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
        <HomeIcon />
      </IconButton>
      <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
        kNODEledge
      </Typography>
      {user ? (
        <>
          <Typography component="div" sx={{ mx: 2 }}>
            {user.email}
          </Typography>
          <Button color="inherit" href="/api/auth/logout">
            Logout
          </Button>
        </>
      ) : (
        <Button color="inherit" href="/api/auth/login">
          Login
        </Button>
      )}
    </Toolbar>
  </AppBar>
);

export default AppHeaderComponent;
