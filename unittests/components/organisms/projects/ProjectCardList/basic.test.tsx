import { createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import ProjectCardList from '@/components/organisms/projects/ProjectCardList';
import { ProjectListContextProvider } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project from Project List API', async () => {
  (global.fetch as jest.Mock).mockReturnValueOnce(
    Promise.resolve(
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
    ),
  );
  const screen = render(<ProjectCardList user={USER} />, { wrapper: ProjectListContextProvider });

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
  (global.fetch as jest.Mock).mockReturnValueOnce(
    Promise.resolve(
      createOkResponse({
        projects: [],
      }),
    ),
  );
  const screen = render(<ProjectCardList user={USER} />, { wrapper: ProjectListContextProvider });

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
