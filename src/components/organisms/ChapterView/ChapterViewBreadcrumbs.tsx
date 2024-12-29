import AppBreadcrumbs from '@/components/molecules/AppBreadcrumbs';
import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { usePaperContent } from '@/contexts/views';
import { Chapter, PaperWithoutAutofield, Project } from '@/openapi';

export type ChapterViewBreadcrumbsComponentProps = {
  readonly project: Project;
  readonly chapter: Chapter;
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const ChapterViewBreadcrumbsComponent: React.FC<ChapterViewBreadcrumbsComponentProps> = ({
  project,
  chapter,
  loadablePaper,
  updatePaper,
}) => {
  const unsavedPaper = usePaperContent();
  const dirty = loadablePaper.state === 'success' && unsavedPaper.content !== loadablePaper.data.content;
  const saveDisabled = loadablePaper.state === 'loading';

  return (
    <AppBreadcrumbs
      chapter={{ id: chapter.id, name: chapter.name }}
      dirty={dirty}
      onSave={async () => {
        if (!dirty) return { success: true };
        const loadableAction = await updatePaper(loadablePaper.data.id, unsavedPaper);
        if (loadableAction.state === 'success') {
          return { success: true };
        }
        if (!loadableAction.error.paper.content) {
          return { success: false, error: loadableAction.error.message };
        }
        return { success: false, error: `${loadableAction.error.message}: ${loadableAction.error.paper.content}` };
      }}
      project={{ id: project.id, name: project.name }}
      saveDisabled={saveDisabled}
    />
  );
};

export default ChapterViewBreadcrumbsComponent;
