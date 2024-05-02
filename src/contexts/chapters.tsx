'use client';
import { createChapter } from '@/actions/chapters/createChapter';
import { listChapter } from '@/actions/chapters/listChapter';
import { Chapter, ChapterWithoutAutofield, ChapterWithoutAutofieldError, ProjectOnlyId, UserOnlyId } from '@/openapi';

import { LoadableAction, LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadableChapterList = LoadableData<Chapter[]>;

export type ChapterActionError = {
  message: string;
  chapter: Required<ChapterWithoutAutofieldError>;
};

export type LoadableActionChapterCreate = (
  project: ChapterWithoutAutofield,
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

export function useInitChapterList(user: UserOnlyId, project: ProjectOnlyId): void {
  const setChapterList = React.useContext(ChapterListSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    setChapterList({ state: 'loading', data: null });

    void (async () => {
      const errorable = await listChapter({ user, project });
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
  }, [user.id, project.id]);
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

    if (errorable.state === 'error' && (!!errorable.error.user.id || !!errorable.error.project.id)) {
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

export const ChapterListContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [chapterList, setChapterList] = React.useState<LoadableChapterList>({ state: 'loading', data: null });

  return (
    <ChapterListValueContext.Provider value={chapterList}>
      <ChapterListSetContext.Provider value={setChapterList}>{children}</ChapterListSetContext.Provider>
    </ChapterListValueContext.Provider>
  );
};
