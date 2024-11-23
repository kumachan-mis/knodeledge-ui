import { LoadableChapter, SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { LoadableProject } from '@/contexts/projects';
import { PaperContentProvider } from '@/contexts/views';
import { PaperWithoutAutofield, SectionWithoutAutofield } from '@/openapi';

import ChapterViewBreadcrumbsComponent from './ChapterViewBreadcrumbs';
import ChapterViewEditorComponent from './ChapterViewEditor';
import ChapterViewFooterComponent from './ChapterViewFooter';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

export type ChapterViewComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly loadableChapter: LoadableChapter;
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
  readonly sectionalizePaper: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
};

const ChapterViewComponent: React.FC<ChapterViewComponentProps> = ({
  loadableChapter,
  loadableProject,
  loadablePaper,
  updatePaper,
  sectionalizePaper,
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
        <Box
          sx={(theme) => ({
            height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 1 }}>
            <ChapterViewBreadcrumbsComponent
              chapter={loadableChapter.data}
              paper={loadablePaper.data}
              project={loadableProject.data}
              updatePaper={updatePaper}
            />
            <ChapterViewEditorComponent />
          </Container>
          <Divider variant="fullWidth" />
          <ChapterViewFooterComponent sectionalizePaper={sectionalizePaper} />
        </Box>
      </PaperContentProvider>
    )
  );

export default ChapterViewComponent;
