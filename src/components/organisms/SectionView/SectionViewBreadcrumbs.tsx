import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { GraphActionError, LoadableGraph } from '@/contexts/graphs';
import { LoadableAction } from '@/contexts/openapi';
import { useGraphContent } from '@/contexts/views';
import { Project, Chapter, SectionOfChapter, GraphContentWithoutAutofield } from '@/openapi';
import { sectionViewContentEquals } from '@/utils/logic';

export type SectionViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly section: SectionOfChapter;
  readonly loadableGraph: LoadableGraph;
  readonly updateGraph: (id: string, graph: GraphContentWithoutAutofield) => Promise<LoadableAction<GraphActionError>>;
};

const SectionViewBreadcrumbsComponent: React.FC<SectionViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  section,
  loadableGraph,
  updateGraph,
}) => {
  const unsavedGraph = useGraphContent();
  const dirty = loadableGraph.state === 'success' && !sectionViewContentEquals(loadableGraph.data, unsavedGraph);

  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      dirty={dirty}
      onSave={async () => {
        if (!dirty) return { success: true };
        const loadableAction = await updateGraph(loadableGraph.data.id, unsavedGraph);
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
