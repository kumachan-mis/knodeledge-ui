import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { LoadableAction } from '@/contexts/openapi';
import { PaperActionError } from '@/contexts/papers';
import { usePaperContent } from '@/contexts/views';
import { Chapter, Paper, PaperWithoutAutofield, Project } from '@/openapi';

export type ChapterViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly paper: Paper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const ChapterViewBreadcrumbsComponent: React.FC<ChapterViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  paper,
  updatePaper,
}) => {
  const unsavedPaper = usePaperContent();
  const isDirty = unsavedPaper.content !== paper.content;
  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      isDirty={isDirty}
      onSave={async () => {
        if (!isDirty) return { success: true };
        const loadableAction = await updatePaper(paper.id, unsavedPaper);
        if (loadableAction.state === 'success') {
          return { success: true };
        }
        if (!loadableAction.error.paper.content) {
          return { success: false, error: loadableAction.error.message };
        }
        return { success: false, error: `${loadableAction.error.message}: ${loadableAction.error.paper.content}` };
      }}
      project={{ id: project.id, name: project.name }}
    />
  );
};

export default ChapterViewBreadcrumbsComponent;
