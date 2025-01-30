import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { GraphActionError, LoadableGraph } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { graphContentEquals, graphContentToServer, useGraphContent } from '@/contexts/views/graph';
import { Project, Chapter, SectionOfChapter, GraphContentWithoutAutofield } from '@/openapi';

import GraphViewIcon from '@mui/icons-material/Hub';
import TextViewIcon from '@mui/icons-material/Notes';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

export type SectionViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly section: SectionOfChapter;
  readonly loadableGraph: LoadableGraph;
  readonly view: 'text' | 'graph';
  readonly onChangeView: React.Dispatch<React.SetStateAction<'text' | 'graph'>>;
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
  view,
  onChangeView,
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
    >
      <Tabs
        onChange={(event, value: 'text' | 'graph') => {
          onChangeView(value);
        }}
        sx={{
          mx: { xs: 0, sm: 0, md: 4 },
          my: 1,
          minHeight: '28px',
          '& button': { minHeight: '28px', fontSize: 'small' },
        }}
        value={view}
        variant="fullWidth"
      >
        <Tab icon={<TextViewIcon />} iconPosition="start" label="Text View" value="text" />
        <Tab icon={<GraphViewIcon />} iconPosition="start" label="Graph View" value="graph" />
      </Tabs>
    </AppBreadcrumbs>
  );
};

export default SectionViewBreadcrumbsComponent;
