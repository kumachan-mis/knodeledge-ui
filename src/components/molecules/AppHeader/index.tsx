import AppToolbar from '@/components/molecules/AppToolbar';

import AppBar from '@mui/material/AppBar';

export type AppHeaderProps = {
  readonly authorized: boolean;
  readonly username?: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ authorized, username }) => (
  <AppBar>
    <AppToolbar authorized={authorized} username={username} />
  </AppBar>
);

export default AppHeader;
