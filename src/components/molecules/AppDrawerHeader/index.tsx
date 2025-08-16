import { APP_DRAWER_WIDTH } from '@/components/molecules/AppDrawer';
import AppToolbar from '@/components/molecules/AppToolbar';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';

export type AppDrawerHeaderProps = {
  readonly userstate: 'authenticated' | 'unauthenticated';
  readonly username?: string;
  readonly mobileAccountMenuOpen: boolean;
  readonly mobileAccountMenuAnchorEl: HTMLElement | null;
  readonly onOpenMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onCloseMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onToggleMobileDrawer: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AppDrawerHeader: React.FC<AppDrawerHeaderProps> = ({ onToggleMobileDrawer, ...rest }) => (
  <AppBar sx={{ width: { md: `calc(100% - ${APP_DRAWER_WIDTH}px)` }, ml: { md: `${APP_DRAWER_WIDTH}px` } }}>
    <AppToolbar
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
      {...rest}
    />
  </AppBar>
);

export default AppDrawerHeader;
