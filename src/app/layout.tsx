import ThemeRegistry from '@/components/atoms/ThemeRegistry';
import PanicError from '@/components/organisms/PanicError';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { ENVIRONMENT } from '@/utils/env';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `kNODEledge${ENVIRONMENT !== 'production' ? ` - ${ENVIRONMENT}` : ''}`,
  description: 'App to Create Graphically-Summarized Notes in Three Steps',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>
      <UserProvider>
        <ThemeRegistry>
          <PanicContextProvider>
            <PanicError />
            {children}
          </PanicContextProvider>
        </ThemeRegistry>
      </UserProvider>
    </body>
  </html>
);

export default Layout;
