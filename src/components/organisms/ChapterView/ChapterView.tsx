import { LoadableChapter } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { LoadableProject } from '@/contexts/projects';
import { PaperContentProvider } from '@/contexts/views';
import { PaperWithoutAutofield } from '@/openapi';

import ChapterViewBreadcrumbsComponent from './ChapterViewBreadcrumbs';
import ChapterViewEditorComponent from './ChapterViewEditor';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

export type ChapterViewComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly loadableChapter: LoadableChapter;
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const ChapterViewComponent: React.FC<ChapterViewComponentProps> = ({
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
      <PaperContentProvider initialContent={loadablePaper.data}>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <ChapterViewBreadcrumbsComponent
            chapter={loadableChapter.data}
            paper={loadablePaper.data}
            project={loadableProject.data}
            updatePaper={updatePaper}
          />
          <ChapterViewEditorComponent />
        </Container>
      </PaperContentProvider>
    )
  );

export default ChapterViewComponent;
