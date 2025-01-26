import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { LoadablePaper, PaperActionError } from '@/contexts/openapi/papers';
import { LoadableAction } from '@/contexts/openapi/types';
import { paperContentEquals, paperContentToServer, usePaperContent } from '@/contexts/views/paper';
import { Chapter, PaperWithoutAutofield, Project } from '@/openapi';

export type ChapterViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly loadablePaper: LoadablePaper;
  readonly onUpdatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const ChapterViewBreadcrumbsComponent: React.FC<ChapterViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  loadablePaper,
  onUpdatePaper,
}) => {
  const unsavedPaper = usePaperContent();
  const dirty = loadablePaper.state === 'success' && !paperContentEquals(unsavedPaper, loadablePaper.data);

  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      dirty={dirty}
      onSave={async () => {
        if (!dirty) return { success: true };
        const loadableAction = await onUpdatePaper(loadablePaper.data.id, paperContentToServer(unsavedPaper));
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
