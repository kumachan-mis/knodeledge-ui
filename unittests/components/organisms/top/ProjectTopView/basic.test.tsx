import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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

test('should show project without description from Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT_WITHOUT_DESCRIPTION',
        name: 'Project Without Description',
      },
    }),
  );

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Without Description')).toBeInTheDocument();
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

test('should show project with description from Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT_WITH_DESCRIPTION',
        name: 'Project With Description',
        description: 'Project Description',
      },
    }),
  );

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project With Description')).toBeInTheDocument();
  });
  expect(screen.getByText('Project Description')).toBeInTheDocument();

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

test('should show error message when internal error occured in Project Find API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

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

test('should update project with Project Update API', async () => {
  const user = userEvent.setup();
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name Updated',
          description: 'Project Description',
        },
      }),
    );

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.getByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByText('Update Project'));

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByRole('textbox', { name: 'Project Name' })).toHaveValue('Project Name');
  expect(dialog.getByRole('textbox', { name: 'Project Description' })).toHaveValue('Project Description');

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(screen.queryByText('Project Name Updated')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT', name: 'Project Name Updated', description: 'Project Description' },
      }),
    }),
  );
});

test('should show error message when project update failed', async () => {
  const user = userEvent.setup();
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(createBadRequestResponse({ user: {}, project: { name: 'name error' } }));

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.getByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByText('Update Project'));

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByRole('textbox', { name: 'Project Name' })).toHaveValue('Project Name');
  expect(dialog.getByRole('textbox', { name: 'Project Description' })).toHaveValue('Project Description');

  await user.clear(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Updated Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('name error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT', name: 'Project Name', description: 'Updated Description' },
      }),
    }),
  );
});

test('should show error message when project to be updated does not exist', async () => {
  const user = userEvent.setup();
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
        },
      }),
    )
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
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

  await user.click(screen.getByText('Update Project'));

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByRole('textbox', { name: 'Project Name' })).toHaveValue('Project Name');
  expect(dialog.getByRole('textbox', { name: 'Project Description' })).toHaveValue('');

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Updated Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT', name: 'Project Name', description: 'Updated Description' },
      }),
    }),
  );
});

test('should show error message when internal error occured in Project Update API', async () => {
  const user = userEvent.setup();
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
        },
      }),
    )
    .mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ProjectTopView user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
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

  await user.click(screen.getByText('Update Project'));

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByRole('textbox', { name: 'Project Name' })).toHaveValue('Project Name');
  expect(dialog.getByRole('textbox', { name: 'Project Description' })).toHaveValue('');

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Updated Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('Internal Server Error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT', name: 'Project Name', description: 'Updated Description' },
      }),
    }),
  );
});
