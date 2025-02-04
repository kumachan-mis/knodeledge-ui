import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export type AppDrawerMainProps = {
  readonly children: React.ReactNode;
};

const AppDrawerMain: React.FC<AppDrawerMainProps> = ({ children }) => (
  <Box component="main" sx={{ display: 'block', width: 0, flexGrow: 1, flexShrink: 1 }}>
    <Toolbar variant="dense" />
    {children}
  </Box>
);

export default AppDrawerMain;
