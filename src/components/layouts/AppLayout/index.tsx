import AppLayoutComponent from './AppLayout';

import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';

export type AppLayoutProps = {
  readonly children?: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = async ({ children }) => {
  const session = await getSession();
  return <AppLayoutComponent user={session?.user}>{children}</AppLayoutComponent>;
};

export default AppLayout;
