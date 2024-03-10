import AppContainer from '@/components/molecules/AppContainer';
import AppHeader from '@/components/molecules/AppHeader';
import AppMain from '@/components/molecules/AppMain';

import { Claims } from '@auth0/nextjs-auth0';
import Toolbar from '@mui/material/Toolbar';

export type AppLayoutComponentProps = {
  readonly user: Claims | undefined;
  readonly children: React.ReactNode;
};

const AppLayoutComponent: React.FC<AppLayoutComponentProps> = ({ user, children }) => (
  <AppContainer>
    <AppHeader authorized={!!user} userName={user?.name} />
    <AppMain>
      <Toolbar />
      {children}
    </AppMain>
  </AppContainer>
);

export default AppLayoutComponent;
