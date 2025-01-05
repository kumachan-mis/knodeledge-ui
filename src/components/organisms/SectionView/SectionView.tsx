import { GraphActionError, LoadableGraph } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { GraphContentProvider } from '@/contexts/views/graph';
import { ChapterWithSections, GraphContentWithoutAutofield, Project, SectionOfChapter } from '@/openapi';

import SectionViewBreadcrumbsComponent from './SectionViewBreadcrumbs';
import SectionViewEditorComponent from './SectionViewEditor';
import SectionViewGraphComponent from './SectionViewGraph';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';

export type SectionViewComponentProps = {
  readonly project: Project;
  readonly chapter: ChapterWithSections;
  readonly section: SectionOfChapter;
  readonly loadableGraph: LoadableGraph;
  readonly onUpdateGraph: (
    id: string,
    graph: GraphContentWithoutAutofield,
  ) => Promise<LoadableAction<GraphActionError>>;
};

const SectionViewComponent: React.FC<SectionViewComponentProps> = ({
  project,
  chapter,
  section,
  loadableGraph,
  onUpdateGraph,
}) => {
  const [view, setView] = React.useState<'text' | 'graph'>('text');

  return (
    <GraphContentProvider loadableGraph={loadableGraph}>
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
            loadableGraph={loadableGraph}
            onChangeView={setView}
            onUpdateGraph={onUpdateGraph}
            project={project}
            section={section}
            view={view}
          />
          {view === 'graph' && <SectionViewGraphComponent loadableGraph={loadableGraph} />}
          <SectionViewEditorComponent loadableGraph={loadableGraph} view={view} />
        </Container>
      </Box>
    </GraphContentProvider>
  );
};

export default SectionViewComponent;
