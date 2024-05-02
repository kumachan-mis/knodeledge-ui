import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/top/ChapterList';
import ChapterListHeader from '@/components/organisms/top/ChapterListHeader';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { ProjectContextProvider } from '@/contexts/projects';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectContextProvider>
    <ChapterListContextProvider>
      <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader}>
        {children}
      </ProjectLayout>
    </ChapterListContextProvider>
  </ProjectContextProvider>
);

export default Layout;
