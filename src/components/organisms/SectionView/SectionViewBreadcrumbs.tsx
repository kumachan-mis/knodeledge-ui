import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { useGraphContent } from '@/contexts/views';
import { Project, Chapter, Graph, SectionOfChapter } from '@/openapi';

export type SectionViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly section: SectionOfChapter;
  readonly graph: Graph;
};

const SectionViewBreadcrumbsComponent: React.FC<SectionViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  section,
  graph,
}) => {
  const unsavedGraph = useGraphContent();
  const isDirty = unsavedGraph.paragraph !== graph.paragraph;
  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      isDirty={isDirty}
      // eslint-disable-next-line @typescript-eslint/require-await
      onSave={async () => {
        return { success: true };
      }}
      project={{ id: project.id, name: project.name }}
      section={{ id: section.id, name: section.name }}
    />
  );
};

export default SectionViewBreadcrumbsComponent;
