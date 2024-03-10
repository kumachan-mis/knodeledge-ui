import AppHeader from '@/components/molecules/AppHeader';

import { Claims } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

export type AppLayoutComponentProps = {
  readonly user: Claims | undefined;
  readonly children: React.ReactNode;
};

const AppLayoutComponent: React.FC<AppLayoutComponentProps> = ({ user, children }) => (
  <Box sx={{ display: 'flex' }}>
    <AppHeader authorized={!!user} userName={user?.name} />
    <Container component="main" maxWidth="lg" sx={{ my: 6 }}>
      <Toolbar />
      {children}
    </Container>
  </Box>
);

export default AppLayoutComponent;
