import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import ProjectView from '@/components/organisms/ProjectView';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider } from '@/contexts/projects';
import { Project } from '@/openapi';

import { render } from '@testing-library/react';

const Wrapper: React.FC<{
  project: Project;
  children?: React.ReactNode;
}> = ({ project, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider initialProject={project}>{children}</ProjectContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project without description', () => {
  const project: Project = {
    id: 'PROJECT',
    name: 'Project Without Description',
  };

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project Without Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should show project with description', () => {
  const project: Project = {
    id: 'PROJECT',
    name: 'Project With Description',
    description: 'Project Description',
  };

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project With Description')).toBeInTheDocument();
  expect(screen.getByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});
