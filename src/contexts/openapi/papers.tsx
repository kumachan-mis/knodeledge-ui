'use client';
import { findPaper } from '@/actions/papers/findPaper';
import { updatePaper } from '@/actions/papers/updatePaper';
import { Paper, PaperWithoutAutofield, PaperWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { useSetPanic } from './panic';
import { LoadableAction, LoadableClientSideData } from './types';

import React from 'react';

export type LoadablePaper = LoadableClientSideData<Paper>;

export type LoadablePaperMap = Map<string, LoadablePaper>;

export type PaperActionError = {
  message: string;
  paper: Required<PaperWithoutAutofieldError>;
};

export type LoadableActionPaperUpdate = (
  id: string,
  paper: PaperWithoutAutofield,
) => Promise<LoadableAction<PaperActionError>>;

export type LoadableActionPaperDelete = (chapterId: string) => Promise<LoadableAction<PaperActionError>>;

const EMPTY_PAPER_ACTION_ERROR: PaperActionError = {
  message: '',
  paper: { content: '' },
} as const;

const UNKNOWN_PAPER_ACTION_ERROR: PaperActionError = {
  message: 'unknown error',
  paper: { content: 'unknown error' },
} as const;

const PaperMapValueContext = React.createContext<LoadablePaperMap>(new Map());

const PaperMapSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadablePaperMap>>>(() => {
  // Do nothing
});

export function useLoadablePaper(chapterId: string): LoadablePaper {
  const paperMap = React.useContext(PaperMapValueContext);
  return paperMap.get(chapterId) ?? { state: 'loading', data: null };
}

export function useInitPaper(userId: string, projectId: string, chapterId: string): void {
  const paperMap = React.useContext(PaperMapValueContext);
  const setPaperMap = React.useContext(PaperMapSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    const loadablePaper = paperMap.get(chapterId);
    if (loadablePaper?.state === 'success') {
      return;
    }

    setPaperMap((prev) => new Map(prev.set(chapterId, { state: 'loading', data: null })));

    void (async () => {
      const errorable = await findPaper({ userId, projectId, chapterId });
      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
        return;
      }

      if (errorable.state === 'error') {
        setPaperMap((prev) => new Map(prev.set(chapterId, { state: 'notfound', data: null })));
        return;
      }

      setPaperMap((prev) => new Map(prev.set(chapterId, { state: 'success', data: errorable.response.paper })));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, projectId, chapterId]);
}

export function useUpdatePaper(user: UserOnlyId, projectId: string, chapterId: string): LoadableActionPaperUpdate {
  const setPanic = useSetPanic();
  const paperMap = React.useContext(PaperMapValueContext);
  const setPaperMap = React.useContext(PaperMapSetContext);

  return async (id, paper) => {
    const loadablePaper = paperMap.get(chapterId);
    if (loadablePaper?.state !== 'success') {
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }
    const errorable = await updatePaper({ user, project: { id: projectId }, paper: { id, ...paper } });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }

    if (errorable.state === 'error' && (!!errorable.error.user?.id || !!errorable.error.project?.id)) {
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }
    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          paper: { ...EMPTY_PAPER_ACTION_ERROR.paper, ...errorable.error.paper },
        },
      };
    }

    setPaperMap((prev) => new Map(prev.set(chapterId, { state: 'success', data: errorable.response.paper })));
    return { state: 'success', error: null };
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDeletePaper(user: UserOnlyId, projectId: string): LoadableActionPaperDelete {
  const setPaperMap = React.useContext(PaperMapSetContext);

  // eslint-disable-next-line @typescript-eslint/require-await
  return async (chapterId) => {
    setPaperMap((prev) => new Map(prev.set(chapterId, { state: 'notfound', data: null })));
    return { state: 'success', error: null };
  };
}

export const CachedPaperContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [paperMap, setPaperMap] = React.useState<LoadablePaperMap>(new Map());

  return (
    <PaperMapValueContext.Provider value={paperMap}>
      <PaperMapSetContext.Provider value={setPaperMap}>{children}</PaperMapSetContext.Provider>
    </PaperMapValueContext.Provider>
  );
};
