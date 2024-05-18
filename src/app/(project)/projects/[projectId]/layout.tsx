import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/top/ChapterList';
import ChapterListHeader from '@/components/organisms/top/ChapterListHeader';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { PaperContextProvider } from '@/contexts/papers';
import { ProjectContextProvider } from '@/contexts/projects';

import { ProjectDetailPageClientProps } from './client';

const Layout: React.FC<{ children: React.ReactNode } & ProjectDetailPageClientProps> = ({
  children,
  params: { projectId },
}) => (
  <ProjectContextProvider>
    <ChapterListContextProvider>
      <PaperContextProvider>
        <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader} projectId={projectId}>
          {children}
        </ProjectLayout>
      </PaperContextProvider>
    </ChapterListContextProvider>
  </ProjectContextProvider>
);

export default Layout;
