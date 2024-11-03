import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/ChapterList';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { GraphContextProvider } from '@/contexts/graphs';
import { PaperContextProvider } from '@/contexts/papers';
import { ProjectContextProvider } from '@/contexts/projects';
export type LayoutProps = {
  readonly params: {
    readonly projectId: string;
  };
  readonly children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children, params: { projectId } }) => (
  <ProjectContextProvider>
    <ChapterListContextProvider>
      <PaperContextProvider>
        <GraphContextProvider>
          <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader} projectId={projectId}>
            {children}
          </ProjectLayout>
        </GraphContextProvider>
      </PaperContextProvider>
    </ChapterListContextProvider>
  </ProjectContextProvider>
);

export default Layout;
