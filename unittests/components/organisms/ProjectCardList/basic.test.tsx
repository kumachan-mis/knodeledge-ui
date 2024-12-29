import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import ProjectCardList from '@/components/organisms/ProjectCardList';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectListContextProvider } from '@/contexts/projects';
import { Project } from '@/openapi';

import { render } from '@testing-library/react';

const Wrapper: React.FC<{
  projectList: Project[];
  children?: React.ReactNode;
}> = ({ projectList, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectListContextProvider initialProjectList={projectList}>{children}</ProjectListContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project from Project List API', () => {
  const projectList: Project[] = [
    {
      id: 'PROJECT_WITHOUT_DESCRIPTION',
      name: 'Project Without Description',
    },
    {
      id: 'PROJECT_WITH_DESCRIPTION',
      name: 'Project With Description',
      description: 'Project Description',
    },
  ];

  const screen = render(<ProjectCardList user={USER} />, {
    wrapper: ({ children }) => <Wrapper projectList={projectList}>{children}</Wrapper>,
  });

  expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should show empty message when no project is available', () => {
  const screen = render(<ProjectCardList user={USER} />, {
    wrapper: ({ children }) => <Wrapper projectList={[]}>{children}</Wrapper>,
  });

  expect(screen.queryByText('No Projects')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});
