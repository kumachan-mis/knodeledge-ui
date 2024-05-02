import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectListContextProvider, useInitProjectList } from '@/contexts/projects';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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

test('should show error message when internal error occured in Project List API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

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

test('should update project with Project Update API', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
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
    )
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description Updated',
          description: 'Updated Description',
        },
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

  await user.click(screen.getAllByLabelText('update project')[0]);

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByRole('textbox', { name: 'Project Name' })).toHaveValue('Project Without Description');
  expect(dialog.getByRole('textbox', { name: 'Project Description' })).toHaveValue('');

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');
  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Updated Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(screen.queryByText('Project Without Description Updated')).toBeInTheDocument();
  expect(screen.queryByText('Updated Description')).toBeInTheDocument();
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description Updated',
          description: 'Updated Description',
        },
      }),
    }),
  );
});

test('should show error message when project update failed', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
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
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({ user: {}, project: { name: 'name error', description: 'description error' } }),
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

  await user.click(screen.getAllByLabelText('update project')[0]);

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');
  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Updated Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('name error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('description error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description Updated',
          description: 'Updated Description',
        },
      }),
    }),
  );
});

test('should show error message when project to be updated does not exist', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
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
    )
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'not found', user: {}, project: {} }));

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

  await user.click(screen.getAllByLabelText('update project')[0]);

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');
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
        project: {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description Updated',
          description: 'Updated Description',
        },
      }),
    }),
  );
});

test('should show error message when internal error occured in Project Update API', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
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
    )
    .mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

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

  await user.click(screen.getAllByLabelText('update project')[0]);

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');
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
        project: {
          id: 'PROJECT_WITHOUT_DESCRIPTION',
          name: 'Project Without Description Updated',
          description: 'Updated Description',
        },
      }),
    }),
  );
});
