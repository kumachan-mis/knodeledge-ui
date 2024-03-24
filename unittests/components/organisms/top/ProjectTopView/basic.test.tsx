import { createInternalErrorResponse, createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectTopView from '@/components/organisms/top/ProjectTopView';
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

  const { getByText } = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

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

  const { getByText } = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

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

test('should show error message when internal error occured', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const { getByText } = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(getByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(getByText('Internal Server Error')).toBeInTheDocument();

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
