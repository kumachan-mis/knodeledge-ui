import AppLayout from '@/components/layouts/AppLayout';
import { ProjectListContextProvider } from '@/contexts/projects';

export type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <ProjectListContextProvider>
    <AppLayout>{children}</AppLayout>
  </ProjectListContextProvider>
);

export default Layout;
