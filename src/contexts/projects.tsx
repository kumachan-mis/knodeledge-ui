'use client';
import { createProject } from '@/actions/projects/createProject';
import { findProject } from '@/actions/projects/findProject';
import { listProject } from '@/actions/projects/listProject';
import { updateProject } from '@/actions/projects/updateProject';
import { Project, ProjectWithoutAutofield, ProjectWithoutAutofieldError, UserOnlyId } from '@/openapi';

import { LoadableAction, LoadableData } from './openapi';
import { useSetPanic } from './panic';

import React from 'react';

export type LoadableProject = LoadableData<Project>;

export type LoadableProjectList = LoadableData<Project[]>;

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
  const setPanic = useSetPanic();

  React.useEffect(() => {
    setProject({ state: 'loading', data: null });

    void (async () => {
      const errorable = await findProject({ user, project: { id: projectId } });
      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
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
          message: errorable.error.message ?? EMPTY_PROJECT_ACTION_ERROR.message,
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

export function useInitProjectList(user: UserOnlyId): void {
  const setProjectList = React.useContext(ProjectListSetContext);
  const setPanic = useSetPanic();

  React.useEffect(() => {
    setProjectList({ state: 'loading', data: null });

    void (async () => {
      const errorable = await listProject({ user });
      if (errorable.state === 'panic') {
        setPanic(errorable.error.message);
        return;
      }

      if (errorable.state === 'error') {
        return;
      }

      setProjectList({ state: 'success', data: errorable.response.projects });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
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
          message: errorable.error.message ?? EMPTY_PROJECT_ACTION_ERROR.message,
          project: { ...EMPTY_PROJECT_ACTION_ERROR.project, ...errorable.error.project },
        },
      };
    }

    setProjectList((prev) => {
      if (prev.state !== 'success') return prev;
      return { state: 'success', data: [errorable.response.project, ...prev.data] };
    });
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
          message: errorable.error.message ?? EMPTY_PROJECT_ACTION_ERROR.message,
          project: { ...EMPTY_PROJECT_ACTION_ERROR.project, ...errorable.error.project },
        },
      };
    }

    setProjectList((prev) => {
      if (prev.state !== 'success') return prev;
      return {
        state: 'success',
        data: prev.data.map((project) =>
          project.id === errorable.response.project.id ? errorable.response.project : project,
        ),
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
