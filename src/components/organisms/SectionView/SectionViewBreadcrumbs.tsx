import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { GraphActionError } from '@/contexts/graphs';
import { LoadableAction } from '@/contexts/openapi';
import { useGraphContent } from '@/contexts/views';
import { Project, Chapter, Graph, SectionOfChapter, GraphContentWithoutAutofield } from '@/openapi';

export type SectionViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly section: SectionOfChapter;
  readonly graph: Graph;
  readonly updateGraph: (id: string, graph: GraphContentWithoutAutofield) => Promise<LoadableAction<GraphActionError>>;
};

const SectionViewBreadcrumbsComponent: React.FC<SectionViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  section,
  graph,
  updateGraph,
}) => {
  const unsavedGraph = useGraphContent();
  const isDirty = unsavedGraph.paragraph !== graph.paragraph;
  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      isDirty={isDirty}
      onSave={async () => {
        if (!isDirty) return { success: true };
        const loadableAction = await updateGraph(graph.id, unsavedGraph);
        if (loadableAction.state === 'success') {
          return { success: true };
        }
        if (!loadableAction.error.graph.paragraph) {
          return { success: false, error: loadableAction.error.message };
        }
        return { success: false, error: `${loadableAction.error.message}: ${loadableAction.error.graph.paragraph}` };
      }}
      project={{ id: project.id, name: project.name }}
      section={{ id: section.id, name: section.name }}
    />
  );
};

export default SectionViewBreadcrumbsComponent;
