import AppHeader from '@/components/organisms/app/AppHeader';

import { Claims } from '@auth0/nextjs-auth0';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

export type AppLayoutComponentProps = {
  readonly user: Claims | undefined;
  readonly children: React.ReactNode;
};

const AppLayoutComponent: React.FC<AppLayoutComponentProps> = ({ user, children }) => (
  <Container component="main" maxWidth="lg" sx={{ my: 6 }}>
    <AppHeader user={user} />
    <Toolbar />
    {children}
  </Container>
);

export default AppLayoutComponent;
