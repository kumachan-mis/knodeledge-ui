'use client';
import { createChapter } from '@/actions/chapters/createChapter';
import { deleteChapter } from '@/actions/chapters/deleteChapter';
import { updateChapter } from '@/actions/chapters/updateChapter';
import { sectionalizeIntoGraphs } from '@/actions/graphs/sectionallizeIntoGraphs';
import {
  ChapterOnlyId,
  ChapterWithSections,
  ChapterWithoutAutofield,
  ChapterWithoutAutofieldError,
  ProjectOnlyId,
  SectionOfChapter,
  SectionWithoutAutofield,
  SectionWithoutAutofieldListError,
  UserOnlyId,
} from '@/openapi';

import { useSetPanic } from './panic';
import { LoadableAction, LoadableServerSideData } from './types';

import React from 'react';

export type LoadableSection = LoadableServerSideData<SectionOfChapter>;

export type LoadableChapter = LoadableServerSideData<ChapterWithSections>;

export type LoadableChapterList = LoadableServerSideData<ChapterWithSections[]>;

export type ChapterActionError = {
  message: string;
  chapter: Required<ChapterWithoutAutofieldError>;
};

export type SectionsActionError = {
  message: string;
  sections: Required<SectionWithoutAutofieldListError>;
};

export type LoadableActionChapterCreate = (
  chapter: ChapterWithoutAutofield,
) => Promise<LoadableAction<ChapterActionError>>;

export type LoadableActionChapterUpdate = (
  id: string,
  chapter: ChapterWithoutAutofield,
) => Promise<LoadableAction<ChapterActionError>>;

export type LoadableActionChapterDelete = (id: string) => Promise<LoadableAction<ChapterActionError>>;

export type LoadableActionSectionalizePaper = (
  sections: SectionWithoutAutofield[],
) => Promise<LoadableAction<SectionsActionError>>;

const EMPTY_CHAPTER_ACTION_ERROR: ChapterActionError = {
  message: '',
  chapter: { name: '', number: '' },
} as const;

const UNKNOWN_CHAPTER_ACTION_ERROR: ChapterActionError = {
  message: 'unknown error',
  chapter: { name: 'unknown error', number: 'unknown error' },
} as const;

const EMPTY_SECTIONS_ACTION_ERROR: SectionsActionError = {
  message: '',
  sections: { message: '', items: [] },
} as const;

const UNKNOWN_SECTIONS_ACTION_ERROR: SectionsActionError = {
  message: 'unknown error',
  sections: { message: 'unknown error', items: [] },
} as const;

const ChapterListValueContext = React.createContext<LoadableChapterList>({ state: 'success', data: [] });

const ChapterListSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableChapterList>>>(() => {
  // Do nothing
});

const ActiveChapterValueContext = React.createContext<LoadableChapter>({
  state: 'success',
  data: { id: '', name: '', number: 0, sections: [] },
});

const AtiveSectionValueContext = React.createContext<LoadableSection>({
  state: 'success',
  data: { id: '', name: '' },
});

export function useLoadableChapterList(): LoadableChapterList {
  return React.useContext(ChapterListValueContext);
}

export function useLoadableActiveChapterInList(): LoadableChapter {
  return React.useContext(ActiveChapterValueContext);
}

export function useLoadableActiveSectionInList(): LoadableSection {
  return React.useContext(AtiveSectionValueContext);
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
          message: errorable.error.message,
          chapter: { ...EMPTY_CHAPTER_ACTION_ERROR.chapter, ...errorable.error.chapter },
        },
      };
    }

    setChapterList((prev) => {
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
          message: errorable.error.message,
          chapter: { ...EMPTY_CHAPTER_ACTION_ERROR.chapter, ...errorable.error.chapter },
        },
      };
    }

    setChapterList((prev) => {
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

export function useDeleteChapterInList(user: UserOnlyId, project: ProjectOnlyId): LoadableActionChapterDelete {
  const setPanic = useSetPanic();
  const setChapterList = React.useContext(ChapterListSetContext);

  return async (id) => {
    const errorable = await deleteChapter({ user, project, chapter: { id } });
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
          message: errorable.error.message,
          chapter: { ...EMPTY_CHAPTER_ACTION_ERROR.chapter, ...errorable.error.chapter },
        },
      };
    }

    setChapterList((prev) => ({
      state: 'success',
      data: prev.data.filter((chapter) => chapter.id !== id),
    }));
    return { state: 'success', error: null };
  };
}

export function useSectionalizePaper(
  user: UserOnlyId,
  project: ProjectOnlyId,
  chapter: ChapterOnlyId,
): LoadableActionSectionalizePaper {
  const setPanic = useSetPanic();
  const setChapterList = React.useContext(ChapterListSetContext);

  return async (sections) => {
    const errorable = await sectionalizeIntoGraphs({ user, project, chapter, sections });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_SECTIONS_ACTION_ERROR };
    }

    if (
      errorable.state === 'error' &&
      (!!errorable.error.user?.id || !!errorable.error.project?.id || !!errorable.error.chapter?.id)
    ) {
      return { state: 'error', error: UNKNOWN_SECTIONS_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          sections: { ...EMPTY_SECTIONS_ACTION_ERROR.sections, ...errorable.error.sections },
        },
      };
    }

    setChapterList((prev) => {
      const prevChapter = prev.data.find((ch) => ch.id === chapter.id);
      if (!prevChapter) return prev;

      const data = prev.data.map((ch) => {
        if (ch.id !== chapter.id) return ch;
        const sections = errorable.response.graphs.map((graph) => ({ id: graph.id, name: graph.name }));
        return { ...ch, sections };
      });
      return { state: 'success', data };
    });
    return { state: 'success', error: null };
  };
}

export const ChapterListContextProvider: React.FC<{
  readonly initialChapterList: ChapterWithSections[];
  readonly children?: React.ReactNode;
}> = ({ initialChapterList, children }) => {
  const [chapterList, setChapterList] = React.useState<LoadableChapterList>({
    state: 'success',
    data: initialChapterList,
  });

  return (
    <ChapterListValueContext.Provider value={chapterList}>
      <ChapterListSetContext.Provider value={setChapterList}>{children}</ChapterListSetContext.Provider>
    </ChapterListValueContext.Provider>
  );
};

export const ActiveChapterContextProvider: React.FC<{
  readonly activeChapter: ChapterWithSections;
  readonly children?: React.ReactNode;
}> = ({ activeChapter, children }) => (
  <ActiveChapterValueContext.Provider value={{ state: 'success', data: activeChapter }}>
    {children}
  </ActiveChapterValueContext.Provider>
);

export const ActiveSectionContextProvider: React.FC<{
  readonly activeSection: SectionOfChapter;
  readonly children?: React.ReactNode;
}> = ({ activeSection, children }) => (
  <AtiveSectionValueContext.Provider value={{ state: 'success', data: activeSection }}>
    {children}
  </AtiveSectionValueContext.Provider>
);
