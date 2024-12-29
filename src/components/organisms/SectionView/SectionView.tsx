import { GraphActionError, LoadableGraph } from '@/contexts/graphs';
import { LoadableAction } from '@/contexts/openapi';
import { GraphContentProvider } from '@/contexts/views';
import { ChapterWithSections, GraphContentWithoutAutofield, Project, SectionOfChapter } from '@/openapi';

import SectionViewBreadcrumbsComponent from './SectionViewBreadcrumbs';
import SectionViewEditorComponent from './SectionViewEditor';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

export type SectionViewComponentProps = {
  readonly project: Project;
  readonly chapter: ChapterWithSections;
  readonly section: SectionOfChapter;
  readonly loadableGraph: LoadableGraph;
  readonly updateGraph: (id: string, graph: GraphContentWithoutAutofield) => Promise<LoadableAction<GraphActionError>>;
};

const SectionViewComponent: React.FC<SectionViewComponentProps> = ({
  project,
  chapter,
  section,
  loadableGraph,
  updateGraph,
}) =>
  loadableGraph.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : loadableGraph.state === 'success' ? (
    <GraphContentProvider initialContent={loadableGraph.data}>
      <Box
        sx={(theme) => ({
          height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 1 }}>
          <SectionViewBreadcrumbsComponent
            chapter={chapter}
            graph={loadableGraph.data}
            project={project}
            section={section}
            updateGraph={updateGraph}
          />
          <SectionViewEditorComponent />
        </Container>
      </Box>
    </GraphContentProvider>
  ) : null;

export default SectionViewComponent;
