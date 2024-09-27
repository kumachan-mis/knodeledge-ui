'use client';
import { createChapter } from '@/actions/chapters/createChapter';
import { listChapter } from '@/actions/chapters/listChapter';
import { updateChapter } from '@/actions/chapters/updateChapter';
import {
  ChapterWithSections,
  ChapterWithoutAutofield,
  ChapterWithoutAutofieldError,
  ProjectOnlyId,
  SectionOfChapter,
  UserOnlyId,
} from '@/openapi';

import { LoadableAction, LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadableSection = LoadableData<SectionOfChapter>;

export type LoadableChapter = LoadableData<ChapterWithSections>;

export type LoadableChapterList = LoadableData<ChapterWithSections[]>;

export type ChapterActionError = {
  message: string;
  chapter: Required<ChapterWithoutAutofieldError>;
};

export type LoadableActionChapterCreate = (
  chapter: ChapterWithoutAutofield,
) => Promise<LoadableAction<ChapterActionError>>;

export type LoadableActionChapterUpdate = (
  id: string,
  chapter: ChapterWithoutAutofield,
) => Promise<LoadableAction<ChapterActionError>>;

const EMPTY_CHAPTER_ACTION_ERROR: ChapterActionError = {
  message: '',
  chapter: { name: '', number: '' },
} as const;

const UNKNOWN_CHAPTER_ACTION_ERROR: ChapterActionError = {
  message: 'unknown error',
  chapter: { name: 'unknown error', number: 'unknown error' },
} as const;

const ChapterListValueContext = React.createContext<LoadableChapterList>({ state: 'loading', data: null });

const ChapterListSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableChapterList>>>(() => {
  // Do nothing
});

export function useLoadableChapterList(): LoadableChapterList {
  return React.useContext(ChapterListValueContext);
}

export function useLoadableChapterInList(chapterId: string): LoadableChapter {
  const loadableChapterList = React.useContext(ChapterListValueContext);
  if (loadableChapterList.state !== 'success') return { state: loadableChapterList.state, data: null };

  const chapter = loadableChapterList.data.find((chapter) => chapter.id === chapterId);
  if (!chapter) return { state: 'notfound', data: null };
  return { state: 'success', data: chapter };
}

export function useLoadableSectionInChapter(chapterId: string, sectionId: string): LoadableSection {
  const loadableChapter = useLoadableChapterInList(chapterId);
  if (loadableChapter.state !== 'success') return { state: loadableChapter.state, data: null };

  const section = loadableChapter.data.sections.find((section) => section.id === sectionId);
  if (!section) return { state: 'notfound', data: null };
  return { state: 'success', data: section };
}

export function useInitChapterList(userId: string, projectId: string): void {
  const setChapterList = React.useContext(ChapterListSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    setChapterList({ state: 'loading', data: null });

    void (async () => {
      const errorable = await listChapter({ user: { id: userId }, project: { id: projectId } });
      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
        return;
      }

      if (errorable.state === 'error') {
        setChapterList({ state: 'notfound', data: null });
        return;
      }

      setChapterList({ state: 'success', data: errorable.response.chapters });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, projectId]);
}

export function useCreateChapterInList(user: UserOnlyId, project: ProjectOnlyId): LoadableActionChapterCreate {
  const setPanic = useSetPanic();
  const setChapterList = React.useContext(ChapterListSetContext);

  return async (chapter) => {
    const errorable = await createChapter({ user, project, chapter });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_CHAPTER_ACTION_ERROR };
    }

    if (errorable.state === 'error' && (!!errorable.error.user?.id || !!errorable.error.project?.id)) {
      return { state: 'error', error: UNKNOWN_CHAPTER_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message ?? EMPTY_CHAPTER_ACTION_ERROR.message,
          chapter: { ...EMPTY_CHAPTER_ACTION_ERROR.chapter, ...errorable.error.chapter },
        },
      };
    }

    setChapterList((prev) => {
      if (prev.state !== 'success') return prev;

      const data = [
        errorable.response.chapter,
        ...prev.data.map((chapter) => {
          if (chapter.number < errorable.response.chapter.number) return chapter;
          return { ...chapter, number: chapter.number + 1 };
        }),
      ];
      data.sort((a, b) => a.number - b.number);

      return { state: 'success', data };
    });
    return { state: 'success', error: null };
  };
}

export function useUpdateChapterInList(user: UserOnlyId, project: ProjectOnlyId): LoadableActionChapterUpdate {
  const setPanic = useSetPanic();
  const setChapterList = React.useContext(ChapterListSetContext);

  return async (id, chapter) => {
    const errorable = await updateChapter({ user, project, chapter: { id, ...chapter } });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_CHAPTER_ACTION_ERROR };
    }

    if (
      errorable.state === 'error' &&
      (!!errorable.error.user?.id || !!errorable.error.project?.id || !!errorable.error.chapter?.id)
    ) {
      return { state: 'error', error: UNKNOWN_CHAPTER_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message ?? EMPTY_CHAPTER_ACTION_ERROR.message,
          chapter: { ...EMPTY_CHAPTER_ACTION_ERROR.chapter, ...errorable.error.chapter },
        },
      };
    }

    setChapterList((prev) => {
      if (prev.state !== 'success') return prev;
      const prevChapter = prev.data.find((chapter) => chapter.id === id);
      if (!prevChapter) return prev;

      const prevChapters = prev.data
        .filter((chapter) => chapter.id !== id)
        .map((chapter) => {
          if (chapter.number < prevChapter.number) return chapter;
          return { ...chapter, number: chapter.number - 1 };
        });

      const data = [
        errorable.response.chapter,
        ...prevChapters.map((chapter) => {
          if (chapter.number < errorable.response.chapter.number) return chapter;
          return { ...chapter, number: chapter.number + 1 };
        }),
      ];
      data.sort((a, b) => a.number - b.number);

      return { state: 'success', data };
    });
    return { state: 'success', error: null };
  };
}

export const ChapterListContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [chapterList, setChapterList] = React.useState<LoadableChapterList>({ state: 'loading', data: null });

  return (
    <ChapterListValueContext.Provider value={chapterList}>
      <ChapterListSetContext.Provider value={setChapterList}>{children}</ChapterListSetContext.Provider>
    </ChapterListValueContext.Provider>
  );
};
