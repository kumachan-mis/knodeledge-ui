import AppLayout from '@/components/layouts/AppLayout';
import { ProjectListContextProvider } from '@/contexts/projects';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectListContextProvider>
    <AppLayout>{children}</AppLayout>
  </ProjectListContextProvider>
);

export default Layout;
