import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

export type AppToolbarProps = {
  readonly authorized: boolean;
  readonly userName?: string;
  readonly ToolbarMenu?: React.FC;
};

const AppToolbar: React.FC<AppToolbarProps> = ({ authorized, userName, ToolbarMenu = () => null }) => (
  <Toolbar variant="dense">
    <ToolbarMenu />
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
);

export default AppToolbar;
