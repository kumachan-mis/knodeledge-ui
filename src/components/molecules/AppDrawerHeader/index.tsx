import { APP_DRAWER_WIDTH } from '@/components/molecules/AppDrawer';
import AppToolbar from '@/components/molecules/AppToolbar';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';

export type AppDrawerHeaderProps = {
  readonly authorized: boolean;
  readonly username?: string;
  readonly onToggleMobileDrawer: () => void;
};

const AppDrawerHeader: React.FC<AppDrawerHeaderProps> = ({ authorized, username, onToggleMobileDrawer }) => (
  <AppBar sx={{ width: { md: `calc(100% - ${APP_DRAWER_WIDTH}px)` }, ml: { md: `${APP_DRAWER_WIDTH}px` } }}>
    <AppToolbar
      authorized={authorized}
      menu={
        <IconButton
          aria-label="open drawer"
          color="inherit"
          edge="start"
          onClick={onToggleMobileDrawer}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      }
      username={username}
    />
  </AppBar>
);

export default AppDrawerHeader;
