'use client';
import { listChapter } from '@/actions/chapters/listChapter';
import { Chapter, ProjectOnlyId, UserOnlyId } from '@/openapi';

import { LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadableChapterList = LoadableData<Chapter[]>;

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

export const ChapterListContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [chapterList, setChapterList] = React.useState<LoadableChapterList>({ state: 'loading', data: null });

  return (
    <ChapterListValueContext.Provider value={chapterList}>
      <ChapterListSetContext.Provider value={setChapterList}>{children}</ChapterListSetContext.Provider>
    </ChapterListValueContext.Provider>
  );
};
