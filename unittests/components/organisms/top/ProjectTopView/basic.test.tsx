import { createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { ProjectContextProvider } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project without description', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT_WITHOUT_DESCRIPTION',
        name: 'Project Without Description',
      },
    }),
  );

  const { getByText } = render(<ProjectTopView projectId="PROJECT" user={USER} />, { wrapper: ProjectContextProvider });

  await waitFor(() => {
    expect(getByText('Project Without Description')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show project with description', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT_WITH_DESCRIPTION',
        name: 'Project With Description',
        description: 'Project Description',
      },
    }),
  );

  const { getByText } = render(<ProjectTopView projectId="PROJECT" user={USER} />, { wrapper: ProjectContextProvider });

  await waitFor(() => {
    expect(getByText('Project With Description')).toBeInTheDocument();
  });
  expect(getByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});