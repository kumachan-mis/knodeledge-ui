'use client';
import { createProject } from '@/actions/projects/createProject';
import { findProject } from '@/actions/projects/findProject';
import { listProject } from '@/actions/projects/listProject';
import { Project, ProjectWithoutAutofield, ProjectWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { LoadableAction, LoadableList, LoadableObject } from './openapi';

import React from 'react';

export type LoadableProject = LoadableObject<Project>;

export type LoadableProjectListItem = { data: Project } & LoadableAction<unknown>;

export type LoadableProjectList = LoadableList<LoadableProjectListItem>;

export type LoadableActionProjectCreate = (
  project: ProjectWithoutAutofield,
) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;

const ProjectValueContext = React.createContext<LoadableProject>({ state: 'loading', data: null });

const ProjectSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableProject>>>(() => {
  // Do nothing
});

const ProjectListValueContext = React.createContext<LoadableProjectList>({ state: 'loading', data: null });

const ProjectListSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableProjectList>>>(() => {
  // Do nothing
});

export function useLoadableProject(): LoadableProject {
  return React.useContext(ProjectValueContext);
}

export function useInitProject(user: UserOnlyId, projectId: string): void {
  const setProject = React.useContext(ProjectSetContext);

  React.useEffect(() => {
    setProject({ state: 'loading', data: null });

    void (async () => {
      const errorable = await findProject({ user, project: { id: projectId } });
      if (errorable.state === 'panic') {
        return;
      }

      if (errorable.state === 'error') {
        setProject({ state: 'notfound', data: null });
        return;
      }

      setProject({ state: 'success', data: errorable.response.project });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, projectId]);
}

export function useLoadableProjectList(): LoadableProjectList {
  return React.useContext(ProjectListValueContext);
}

export function useInitProjectList(user: UserOnlyId): void {
  const setProjectList = React.useContext(ProjectListSetContext);

  React.useEffect(() => {
    setProjectList({ state: 'loading', data: null });

    void (async () => {
      const errorable = await listProject({ user });
      if (errorable.state === 'panic') {
        return;
      }

      if (errorable.state === 'error') {
        return;
      }

      setProjectList({
        state: 'success',
        data: errorable.response.projects.map((project) => ({
          state: 'success',
          data: project,
          error: null,
        })),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
}

export function useCreateProject(user: UserOnlyId): LoadableActionProjectCreate {
  const setProjectList = React.useContext(ProjectListSetContext);
  return async (project) => {
    const errorable = await createProject({ user, project });
    if (errorable.state === 'panic') {
      return {
        state: 'error',
        error: { name: 'unknown error', description: 'unknown error' },
      };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: errorable.error.project ?? { name: 'unknown error', description: 'unknown error' },
      };
    }

    setProjectList((prev) => {
      if (prev.state !== 'success') return prev;
      return {
        state: 'success',
        data: [
          {
            state: 'success',
            data: errorable.response.project,
            error: null,
          },
          ...prev.data,
        ],
      };
    });
    return { state: 'success', error: null };
  };
}

export const ProjectContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = React.useState<LoadableProject>({ state: 'loading', data: null });

  return (
    <ProjectValueContext.Provider value={project}>
      <ProjectSetContext.Provider value={setProject}>{children}</ProjectSetContext.Provider>
    </ProjectValueContext.Provider>
  );
};

export const ProjectListContextProvider: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  const [projectList, setProjectList] = React.useState<LoadableProjectList>({ state: 'loading', data: null });

  return (
    <ProjectListValueContext.Provider value={projectList}>
      <ProjectListSetContext.Provider value={setProjectList}>{children}</ProjectListSetContext.Provider>
    </ProjectListValueContext.Provider>
  );
};
