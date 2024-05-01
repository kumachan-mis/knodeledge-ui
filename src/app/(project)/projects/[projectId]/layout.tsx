import ProjectLayout from '@/components/layouts/ProjectLayout';
import ProjectDrawerContent from '@/components/organisms/top/ProjectDrawerContent';
import { ChapterListContextProvider } from '@/contexts/chapters';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChapterListContextProvider>
    <ProjectLayout DrawerContent={ProjectDrawerContent}>{children}</ProjectLayout>
  </ChapterListContextProvider>
);

export default Layout;
