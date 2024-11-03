import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/ChapterList';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { GraphContextProvider } from '@/contexts/graphs';
import { PaperContextProvider } from '@/contexts/papers';
import { ProjectContextProvider } from '@/contexts/projects';

export type LayoutProps = {
  readonly params: Promise<{
    readonly projectId: string;
  }>;
  readonly children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = async ({ children, params }) => (
  <ProjectContextProvider>
    <ChapterListContextProvider>
      <PaperContextProvider>
        <GraphContextProvider>
          <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader} {...await params}>
            {children}
          </ProjectLayout>
        </GraphContextProvider>
      </PaperContextProvider>
    </ChapterListContextProvider>
  </ProjectContextProvider>
);

export default Layout;
