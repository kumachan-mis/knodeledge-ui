import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { LoadableAction } from '@/contexts/openapi';
import { PaperActionError } from '@/contexts/papers';
import { usePaperContent } from '@/contexts/views';
import { Chapter, Paper, PaperWithoutAutofield, Project } from '@/openapi';

import React from 'react';

export type PaperViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly paper: Paper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const PaperViewBreadcrumbsComponent: React.FC<PaperViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  paper,
  updatePaper,
}) => {
  const content = usePaperContent();
  const isDirty = content !== paper.content;
  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      isDirty={isDirty}
      onSave={() => {
        if (!isDirty) return;
        void updatePaper(paper.id, { content });
      }}
      project={{ id: project.id, name: project.name }}
    />
  );
};

export default PaperViewBreadcrumbsComponent;
