import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { GraphActionError, LoadableGraph } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { graphContentEquals, graphContentToServer, useGraphContent } from '@/contexts/views/graph';
import { Project, Chapter, SectionOfChapter, GraphContentWithoutAutofield } from '@/openapi';

export type SectionViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly section: SectionOfChapter;
  readonly loadableGraph: LoadableGraph;
  readonly onUpdateGraph: (
    id: string,
    graph: GraphContentWithoutAutofield,
  ) => Promise<LoadableAction<GraphActionError>>;
};

const SectionViewBreadcrumbsComponent: React.FC<SectionViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  section,
  loadableGraph,
  onUpdateGraph,
}) => {
  const unsavedGraph = useGraphContent();
  const dirty = loadableGraph.state === 'success' && !graphContentEquals(unsavedGraph, loadableGraph.data);

  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      dirty={dirty}
      onSave={async () => {
        if (!dirty) return { success: true };
        const loadableAction = await onUpdateGraph(loadableGraph.data.id, graphContentToServer(unsavedGraph));
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
