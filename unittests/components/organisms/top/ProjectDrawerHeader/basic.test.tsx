import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectDrawerHeader from '@/components/organisms/top/ProjectDrawerHeader';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider>
      <HooksWrapper>{children}</HooksWrapper>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitProject({ id: USER.sub }, 'PROJECT');
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project name from Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT',
        name: 'Project Name',
        description: 'Project Description',
      },
    }),
  );

  const screen = render(<ProjectDrawerHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

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

test('should show nothing when not foud error occured Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'Not Found' }));

  const screen = render(<ProjectDrawerHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
  expect(screen.queryByText('Not Found')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show error message when internal error occured in Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ProjectDrawerHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();

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
