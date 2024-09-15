import AppLayoutComponent from './AppLayout';

import { getSession } from '@auth0/nextjs-auth0';

export type AppLayoutProps = {
  readonly children?: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = async (props) => {
  const session = await getSession();
  return <AppLayoutComponent {...props} user={session?.user} />;
};

export default AppLayout;
