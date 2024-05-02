import ProjectLayout from '@/components/layouts/ProjectLayout';
import ProjectDrawerContent from '@/components/organisms/top/ProjectDrawerContent';
import ProjectDrawerHeader from '@/components/organisms/top/ProjectDrawerHeader';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { ProjectContextProvider } from '@/contexts/projects';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectContextProvider>
    <ChapterListContextProvider>
      <ProjectLayout DrawerContent={ProjectDrawerContent} DrawerHeader={ProjectDrawerHeader}>
        {children}
      </ProjectLayout>
    </ChapterListContextProvider>
  </ProjectContextProvider>
);

export default Layout;
