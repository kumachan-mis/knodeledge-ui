'use client';
import { fetchProjectList } from '@/actions/projects/fetchProjectList';
import { Project, User } from '@/openapi';

import { LoadableAction, LoadableData } from './openapi';

import React from 'react';

export type LoadableProject = { data: Project } & LoadableAction<unknown>;

export type LoadableProjectList = LoadableData<LoadableProject[]>;

const ProjectListValueContext = React.createContext<LoadableProjectList>({ state: 'loading', data: null, error: null });

const ProjectListSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableProjectList>>>(() => {
  // Do nothing
});

export function useLoadableProjectList(): LoadableProjectList {
  return React.useContext(ProjectListValueContext);
}

export function useInitProjectList(user: User): void {
  const setProjectList = React.useContext(ProjectListSetContext);

  React.useEffect(() => {
    setProjectList({ state: 'loading', data: null, error: null });

    void (async () => {
      const errorable = await fetchProjectList({ user });
      if (errorable.state !== 'success') return;

      const { projects } = errorable.response;
      const data: LoadableProject[] = projects.map((project) => ({ state: 'success', data: project, error: null }));
      setProjectList({ state: 'success', data, error: null });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
}

export const ProjectListContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [projectList, setProjectList] = React.useState<LoadableProjectList>({
    state: 'loading',
    data: null,
    error: null,
  });

  return (
    <ProjectListValueContext.Provider value={projectList}>
      <ProjectListSetContext.Provider value={setProjectList}>{children}</ProjectListSetContext.Provider>
    </ProjectListValueContext.Provider>
  );
};
