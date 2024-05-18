'use client';
import { findPaper } from '@/actions/papers/findPaper';
import { updatePaper } from '@/actions/papers/updatePaper';
import { Paper, PaperWithoutAutofield, PaperWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { LoadableAction, LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadablePaper = LoadableData<Paper>;

export type LoadablePaperMap = Map<string, LoadablePaper>;

export type PaperActionError = {
  message: string;
  paper: Required<PaperWithoutAutofieldError>;
};

export type LoadableActionPaperUpdate = (
  id: string,
  paper: PaperWithoutAutofield,
) => Promise<LoadableAction<PaperActionError>>;

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

export function useInitPaper(user: UserOnlyId, projectId: string, chapterId: string): void {
  const paperMap = React.useContext(PaperMapValueContext);
  const setPaperMap = React.useContext(PaperMapSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    if (paperMap.get(chapterId)?.state === 'success') {
      return;
    }

    setPaperMap(new Map(paperMap.set(chapterId, { state: 'loading', data: null })));

    void (async () => {
      const errorable = await findPaper({ user, project: { id: projectId }, chapter: { id: chapterId } });
      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
        return;
      }

      if (errorable.state === 'error') {
        setPaperMap(new Map(paperMap.set(chapterId, { state: 'notfound', data: null })));
        return;
      }

      setPaperMap(new Map(paperMap.set(chapterId, { state: 'success', data: errorable.response.paper })));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, projectId, chapterId]);
}

export const PaperContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [paperMap, setPaperMap] = React.useState<LoadablePaperMap>(new Map());

  return (
    <PaperMapValueContext.Provider value={paperMap}>
      <PaperMapSetContext.Provider value={setPaperMap}>{children}</PaperMapSetContext.Provider>
    </PaperMapValueContext.Provider>
  );
};

export function useUpdatePaper(user: UserOnlyId, projectId: string, chapterId: string): LoadableActionPaperUpdate {
  const setPanic = useSetPanic();
  const paperMap = React.useContext(PaperMapValueContext);
  const setPaperMap = React.useContext(PaperMapSetContext);

  return async (id, paper) => {
    if (paperMap.get(id)?.state !== 'success') {
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }
    const errorable = await updatePaper({ user, project: { id: projectId }, paper: { id, ...paper } });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }

    if (errorable.state === 'error' && (!!errorable.error.user.id || !!errorable.error.project.id)) {
      return { state: 'error', error: UNKNOWN_PAPER_ACTION_ERROR };
    }
    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message ?? EMPTY_PAPER_ACTION_ERROR.message,
          paper: { ...EMPTY_PAPER_ACTION_ERROR.paper, ...errorable.error.paper },
        },
      };
    }

    setPaperMap(new Map(paperMap.set(chapterId, { state: 'success', data: errorable.response.paper })));
    return { state: 'success', error: null };
  };
}
