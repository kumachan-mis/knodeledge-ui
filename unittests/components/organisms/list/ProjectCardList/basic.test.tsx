import { createErrorResponse, createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectListContextProvider, useInitProjectList } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectListContextProvider>
      <HooksWrapper>{children}</HooksWrapper>
    </ProjectListContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitProjectList({ id: USER.sub });
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project from Project List API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      projects: [
        {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description',
        },
        {
          id: 'PROJECT_WITH_DESCRIPTION',
          name: 'Project With Description',
          description: 'Project Description',
        },
      ],
    }),
  );

  const screen = render(<ProjectCardList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );
});

test('should show empty message when no project is available', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createOkResponse({ projects: [] }));

  const screen = render(<ProjectCardList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('No Projects')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );
});

test('should show error message when internal error occured', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ProjectCardList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('Internal Server Error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );
});
