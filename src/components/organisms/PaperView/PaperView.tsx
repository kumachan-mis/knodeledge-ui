import { LoadableChapter } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { LoadableProject } from '@/contexts/projects';
import { PaperContentProvider } from '@/contexts/views';
import { PaperWithoutAutofield } from '@/openapi';

import PaperViewBreadcrumbsComponent from './PaperViewBreadcrumbs';
import PaperViewEditorComponent from './PaperViewEditor';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

export type PaperViewComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly loadableChapter: LoadableChapter;
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const PaperViewComponent: React.FC<PaperViewComponentProps> = ({
  loadableChapter,
  loadableProject,
  loadablePaper,
  updatePaper,
}) =>
  loadableProject.state === 'loading' || loadableChapter.state === 'loading' || loadablePaper.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : (
    loadableProject.state === 'success' &&
    loadableChapter.state === 'success' &&
    loadablePaper.state === 'success' && (
      <PaperContentProvider initialContent={loadablePaper.data.content}>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <PaperViewBreadcrumbsComponent
            chapter={loadableChapter.data}
            paper={loadablePaper.data}
            project={loadableProject.data}
            updatePaper={updatePaper}
          />
          <PaperViewEditorComponent />
        </Container>
      </PaperContentProvider>
    )
  );

export default PaperViewComponent;
