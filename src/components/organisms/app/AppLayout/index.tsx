import AppLayoutComponent from './AppLayout';

import { getSession } from '@auth0/nextjs-auth0';

export type AppLayoutComponentProps = {
  readonly children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutComponentProps> = async ({ children }) => {
  const session = await getSession();
  return <AppLayoutComponent user={session?.user}>{children}</AppLayoutComponent>;
};

export default AppLayout;
