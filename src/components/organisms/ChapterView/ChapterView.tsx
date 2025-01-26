import { SectionsActionError } from '@/contexts/openapi/chapters';
import { LoadablePaper, PaperActionError } from '@/contexts/openapi/papers';
import { LoadableAction } from '@/contexts/openapi/types';
import { PaperContentProvider } from '@/contexts/views/paper';
import { ChapterWithSections, PaperWithoutAutofield, Project, SectionWithoutAutofield } from '@/openapi';

import ChapterViewBreadcrumbsComponent from './ChapterViewBreadcrumbs';
import ChapterViewEditorComponent from './ChapterViewEditor';
import ChapterViewFooterComponent from './ChapterViewFooter';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

export type ChapterViewComponentProps = {
  readonly project: Project;
  readonly chapter: ChapterWithSections;
  readonly loadablePaper: LoadablePaper;
  readonly onUpdatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
  readonly onSectionalizePaper: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
};

const ChapterViewComponent: React.FC<ChapterViewComponentProps> = ({
  project,
  chapter,
  loadablePaper,
  onUpdatePaper,
  onSectionalizePaper,
}) => (
  <PaperContentProvider loadablePaper={loadablePaper}>
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
          loadablePaper={loadablePaper}
          onUpdatePaper={onUpdatePaper}
          project={project}
        />
        <ChapterViewEditorComponent loadablePaper={loadablePaper} />
      </Container>
      <Divider variant="fullWidth" />
      <ChapterViewFooterComponent loadablePaper={loadablePaper} onSectionalizePaper={onSectionalizePaper} />
    </Box>
  </PaperContentProvider>
);

export default ChapterViewComponent;
