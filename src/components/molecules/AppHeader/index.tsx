import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';

export type AppHeaderProps = {
  readonly authorized: boolean;
  readonly userName?: string;
  readonly sx?: SxProps<Theme>;
  readonly AppHeaderMenu?: React.FC;
};

const AppHeader: React.FC<AppHeaderProps> = ({ authorized, userName, sx, AppHeaderMenu = () => null }) => (
  <AppBar sx={sx}>
    <Toolbar variant="dense">
      <AppHeaderMenu />
      <Box sx={{ flexGrow: 1 }}>
        <Button LinkComponent={Link} color="inherit" href="/" sx={{ textTransform: 'none' }}>
          <Typography component="div" variant="h6">
            kNODEledge
          </Typography>
        </Button>
      </Box>
      {userName ?? (
        <Typography component="div" sx={{ mx: 2 }}>
          {userName}
        </Typography>
      )}
      {authorized ? (
        <Button color="inherit" href="/api/auth/logout">
          Logout
        </Button>
      ) : (
        <Button color="inherit" href="/api/auth/login">
          Login
        </Button>
      )}
    </Toolbar>
  </AppBar>
);

export default AppHeader;
