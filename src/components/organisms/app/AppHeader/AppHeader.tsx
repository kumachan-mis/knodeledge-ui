import { Claims } from '@auth0/nextjs-auth0';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';

export type AppHeaderComponentProps = {
  readonly user: Claims | undefined;
  readonly sx?: SxProps<Theme>;
  readonly AppHeaderMenu?: React.FC<{ user: Claims | undefined }>;
};

const AppHeaderComponent: React.FC<AppHeaderComponentProps> = ({ user, sx, AppHeaderMenu = () => null }) => (
  <AppBar sx={sx}>
    <Toolbar variant="dense">
      <AppHeaderMenu user={user} />
      <Box sx={{ flexGrow: 1 }}>
        <Button LinkComponent={Link} color="inherit" href="/" sx={{ textTransform: 'none' }}>
          <Typography component="div" variant="h6">
            kNODEledge
          </Typography>
        </Button>
      </Box>
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
