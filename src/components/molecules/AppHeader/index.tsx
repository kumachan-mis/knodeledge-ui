import AppToolbar from '@/components/molecules/AppToolbar';

import AppBar from '@mui/material/AppBar';
import React from 'react';

export type AppHeaderProps = {
  readonly authorized: boolean;
  readonly userName?: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ authorized, userName }) => (
  <AppBar>
    <AppToolbar authorized={authorized} userName={userName} />
  </AppBar>
);

export default AppHeader;
