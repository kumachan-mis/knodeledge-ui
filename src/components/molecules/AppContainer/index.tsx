import Box from '@mui/material/Box';

export type AppContainerProps = {
  children: React.ReactNode;
};

const AppContainer: React.FC<AppContainerProps> = ({ children }) => <Box sx={{ display: 'flex' }}>{children}</Box>;

export default AppContainer;
