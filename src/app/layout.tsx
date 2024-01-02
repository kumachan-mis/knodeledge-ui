import AppHeader from '../components/organisms/AppHeader';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'kNODEledge',
  description: 'App to Create Graphically-Summarized Notes in Three Steps',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>
      <AppHeader />
      {children}
    </body>
  </html>
);

export default RootLayout;
