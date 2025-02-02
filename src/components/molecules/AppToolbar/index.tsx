import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type AppToolbarProps = {
  readonly authorized: boolean;
  readonly username?: string;
  readonly menu?: React.ReactNode;
  readonly mobileAccountMenuOpen: boolean;
  readonly mobileAccountMenuAnchorEl: HTMLElement | null;
  readonly onOpenMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onCloseMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AppToolbar: React.FC<AppToolbarProps> = ({
  authorized,
  username,
  menu,
  mobileAccountMenuOpen,
  mobileAccountMenuAnchorEl,
  onOpenMobileAccountMenu,
  onCloseMobileAccountMenu,
}) => (
  <Toolbar variant="dense">
    {menu}
    <Box sx={{ flexGrow: 1 }}>
      <Button LinkComponent={Link} color="inherit" href="/" sx={{ textTransform: 'none' }}>
        <Typography component="div" variant="h6">
          kNODEledge
        </Typography>
      </Button>
    </Box>
    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
      <IconButton
        aria-expanded={mobileAccountMenuOpen ? 'true' : undefined}
        aria-haspopup="true"
        aria-label="account"
        color="inherit"
        onClick={onOpenMobileAccountMenu}
      >
        <AccountCircleIcon />
      </IconButton>
      <Popover
        anchorEl={mobileAccountMenuAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted // Better open performance on mobile
        onClose={onCloseMobileAccountMenu}
        open={mobileAccountMenuOpen}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {authorized ? (
          <>
            <Typography component="div" sx={{ px: 2, py: 1 }}>
              {username ?? ''}
            </Typography>
            <Divider />
            <MenuItem component={Link} href="/api/auth/logout">
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem component={Link} href="/api/auth/login">
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Popover>
    </Box>
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
      <Typography component="div" sx={{ mr: 4 }}>
        {username ?? ''}
      </Typography>
      {authorized ? (
        <Button color="inherit" component={Link} href="/api/auth/logout" startIcon={<LogoutIcon fontSize="small" />}>
          Logout
        </Button>
      ) : (
        <Button color="inherit" component={Link} href="/api/auth/login" startIcon={<LoginIcon fontSize="small" />}>
          Login
        </Button>
      )}
    </Box>
  </Toolbar>
);

export default AppToolbar;
