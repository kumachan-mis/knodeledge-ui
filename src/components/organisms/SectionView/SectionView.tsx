import { LoadableChapter, LoadableSection } from '@/contexts/chapters';
import { LoadableGraph } from '@/contexts/graphs';
import { LoadableProject } from '@/contexts/projects';
import { GraphContentProvider } from '@/contexts/views';

import SectionViewBreadcrumbsComponent from './SectionViewBreadcrumbs';
import SectionViewEditorComponent from './SectionViewEditor';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

export type SectionViewComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly loadableChapter: LoadableChapter;
  readonly loadableSection: LoadableSection;
  readonly loadableGraph: LoadableGraph;
};

const SectionViewComponent: React.FC<SectionViewComponentProps> = ({
  loadableProject,
  loadableChapter,
  loadableSection,
  loadableGraph,
}) =>
  loadableProject.state === 'loading' ||
  loadableChapter.state === 'loading' ||
  loadableSection.state === 'loading' ||
  loadableGraph.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : (
    loadableProject.state === 'success' &&
    loadableChapter.state === 'success' &&
    loadableSection.state === 'success' &&
    loadableGraph.state === 'success' && (
      <GraphContentProvider initialContent={loadableGraph.data}>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <SectionViewBreadcrumbsComponent
            chapter={loadableChapter.data}
            graph={loadableGraph.data}
            project={loadableProject.data}
            section={loadableSection.data}
          />
          <SectionViewEditorComponent />
        </Container>
      </GraphContentProvider>
    )
  );

export default SectionViewComponent;
