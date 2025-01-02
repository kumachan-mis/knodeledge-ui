'use client';
import { createProject } from '@/actions/projects/createProject';
import { updateProject } from '@/actions/projects/updateProject';
import { Project, ProjectWithoutAutofield, ProjectWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { useSetPanic } from './panic';
import { LoadableAction, LoadableServerSideData } from './types';

import React from 'react';

export type LoadableProject = LoadableServerSideData<Project>;

export type LoadableProjectList = LoadableServerSideData<Project[]>;

export type ProjectActionError = {
  message: string;
  project: Required<ProjectWithoutAutofieldError>;
};

export type LoadableActionProjectCreate = (
  project: ProjectWithoutAutofield,
) => Promise<LoadableAction<ProjectActionError>>;

export type LoadableActionProjectUpdate = (
  id: string,
  project: ProjectWithoutAutofield,
) => Promise<LoadableAction<ProjectActionError>>;

const EMPTY_PROJECT_ACTION_ERROR: ProjectActionError = {
  message: '',
  project: { name: '', description: '' },
} as const;

const UNKNOWN_PROJECT_ACTION_ERROR: ProjectActionError = {
  message: 'unknown error',
  project: { name: 'unknown error', description: 'unknown error' },
} as const;

const ProjectValueContext = React.createContext<LoadableProject>({ state: 'success', data: { id: '', name: '' } });

const ProjectSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableProject>>>(() => {
  // Do nothing
});

const ProjectListValueContext = React.createContext<LoadableProjectList>({ state: 'success', data: [] });

const ProjectListSetContext = React.createContext<React.Dispatch<React.SetStateAction<LoadableProjectList>>>(() => {
  // Do nothing
});

export function useLoadableProject(): LoadableProject {
  return React.useContext(ProjectValueContext);
}

export function useUpdateProject(user: UserOnlyId): LoadableActionProjectUpdate {
  const setPanic = useSetPanic();
  const setProject = React.useContext(ProjectSetContext);

  return async (id, project) => {
    const errorable = await updateProject({ user, project: { id, ...project } });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }

    if (errorable.state === 'error' && (!!errorable.error.user?.id || !!errorable.error.project?.id)) {
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }
    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          project: { ...EMPTY_PROJECT_ACTION_ERROR.project, ...errorable.error.project },
        },
      };
    }

    setProject({ state: 'success', data: errorable.response.project });
    return { state: 'success', error: null };
  };
}

export function useLoadableProjectList(): LoadableProjectList {
  return React.useContext(ProjectListValueContext);
}

export function useCreateProjectInList(user: UserOnlyId): LoadableActionProjectCreate {
  const setPanic = useSetPanic();
  const setProjectList = React.useContext(ProjectListSetContext);

  return async (project) => {
    const errorable = await createProject({ user, project });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }

    if (errorable.state === 'error' && !!errorable.error.user?.id) {
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          project: { ...EMPTY_PROJECT_ACTION_ERROR.project, ...errorable.error.project },
        },
      };
    }

    setProjectList((prev) => ({ state: 'success', data: [errorable.response.project, ...prev.data] }));
    return { state: 'success', error: null };
  };
}

export function useUpdateProjectInList(user: UserOnlyId): LoadableActionProjectUpdate {
  const setPanic = useSetPanic();
  const setProjectList = React.useContext(ProjectListSetContext);

  return async (id, project) => {
    const errorable = await updateProject({ user, project: { id, ...project } });
    if (errorable.state === 'panic') {
      setPanic(errorable.error.message);
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }

    if (errorable.state === 'error' && (!!errorable.error.user?.id || !!errorable.error.project?.id)) {
      return { state: 'error', error: UNKNOWN_PROJECT_ACTION_ERROR };
    }

    if (errorable.state === 'error') {
      return {
        state: 'error',
        error: {
          message: errorable.error.message,
          project: { ...EMPTY_PROJECT_ACTION_ERROR.project, ...errorable.error.project },
        },
      };
    }

    setProjectList((prev) => ({
      state: 'success',
      data: prev.data.map((project) =>
        project.id === errorable.response.project.id ? errorable.response.project : project,
      ),
    }));
    return { state: 'success', error: null };
  };
}

export const ProjectContextProvider: React.FC<{
  readonly initialProject: Project;
  readonly children?: React.ReactNode;
}> = ({ initialProject, children }) => {
  const [project, setProject] = React.useState<LoadableProject>({ state: 'success', data: initialProject });

  return (
    <ProjectValueContext.Provider value={project}>
      <ProjectSetContext.Provider value={setProject}>{children}</ProjectSetContext.Provider>
    </ProjectValueContext.Provider>
  );
};

export const ProjectListContextProvider: React.FC<{
  readonly initialProjectList: Project[];
  readonly children?: React.ReactNode;
}> = ({ initialProjectList, children }) => {
  const [projectList, setProjectList] = React.useState<LoadableProjectList>({
    state: 'success',
    data: initialProjectList,
  });

  return (
    <ProjectListValueContext.Provider value={projectList}>
      <ProjectListSetContext.Provider value={setProjectList}>{children}</ProjectListSetContext.Provider>
    </ProjectListValueContext.Provider>
  );
};
