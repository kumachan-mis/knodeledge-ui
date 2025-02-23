import { auth0 } from '@/libs/auth0';

import AppLayoutComponent from './AppLayout';

export type AppLayoutProps = {
  readonly children?: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = async (props) => {
  const session = await auth0.getSession();
  return <AppLayoutComponent {...props} user={session?.user} />;
};

export default AppLayout;
