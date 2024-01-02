import AppHeader from '@/components/organisms/AppHeader';
import ThemeRegistry from '@/components/atoms/ThemeRegistry';
import { Metadata } from 'next';
import Toolbar from '@mui/material/Toolbar';

export const metadata: Metadata = {
  title: 'kNODEledge',
  description: 'App to Create Graphically-Summarized Notes in Three Steps',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>
      <ThemeRegistry>
        <AppHeader />
        <Toolbar />
        {children}
      </ThemeRegistry>
    </body>
  </html>
);

export default RootLayout;
