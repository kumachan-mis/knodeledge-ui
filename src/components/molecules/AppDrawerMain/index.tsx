import { APP_DRAWER_WIDTH } from '@/components/molecules/AppDrawer';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export type AppDrawerMainProps = {
  readonly children: React.ReactNode;
};

const AppDrawerMain: React.FC<AppDrawerMainProps> = ({ children }) => (
  <Box component="main" sx={{ width: { md: `calc(100% - ${APP_DRAWER_WIDTH}px)` } }}>
    <Toolbar variant="dense" />
    {children}
  </Box>
);

export default AppDrawerMain;
