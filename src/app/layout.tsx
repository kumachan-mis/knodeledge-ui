import ThemeRegistry from '@/components/atoms/ThemeRegistry';
import AppHeader from '@/components/organisms/AppHeader';
import { ENVIRONMENT } from '@/utils/env';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import Toolbar from '@mui/material/Toolbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `kNODEledge${ENVIRONMENT !== 'production' ? ` - ${ENVIRONMENT}` : ''}`,
  description: 'App to Create Graphically-Summarized Notes in Three Steps',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <UserProvider>
      <ThemeRegistry>
        <body>
          <AppHeader />
          <Toolbar />
          {children}
        </body>
      </ThemeRegistry>
    </UserProvider>
  </html>
);

export default RootLayout;
