import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { PaperContentProvider } from '@/contexts/views';
import { ChapterWithSections, PaperWithoutAutofield, Project, SectionWithoutAutofield } from '@/openapi';

import ChapterViewBreadcrumbsComponent from './ChapterViewBreadcrumbs';
import ChapterViewEditorComponent from './ChapterViewEditor';
import ChapterViewFooterComponent from './ChapterViewFooter';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

export type ChapterViewComponentProps = {
  readonly project: Project;
  readonly chapter: ChapterWithSections;
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
  readonly sectionalizePaper: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
};

const ChapterViewComponent: React.FC<ChapterViewComponentProps> = ({
  project,
  chapter,
  loadablePaper,
  updatePaper,
  sectionalizePaper,
}) =>
  loadablePaper.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : loadablePaper.state === 'success' ? (
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
            chapter={chapter}
            paper={loadablePaper.data}
            project={project}
            updatePaper={updatePaper}
          />
          <ChapterViewEditorComponent />
        </Container>
        <Divider variant="fullWidth" />
        <ChapterViewFooterComponent sectionalizePaper={sectionalizePaper} />
      </Box>
    </PaperContentProvider>
  ) : null;

export default ChapterViewComponent;
