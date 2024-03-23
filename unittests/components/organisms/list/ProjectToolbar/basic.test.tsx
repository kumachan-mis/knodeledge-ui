import { createErrorResponse, createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import ProjectToolbar from '@/components/organisms/list/ProjectToolbar';
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

test('should create a project', async () => {
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
          id: 'TEST_PROJECT',
          name: 'Test Project',
          description: '',
        },
      }),
    );

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: Wrapper },
  );

  await waitFor(() => {
    expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Test Project');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Project' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Project' }));

  await waitFor(() => {
    expect(within(screen.baseElement).queryByRole('dialog')).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.queryByText('Test Project')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/create`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { name: 'Test Project', description: '' },
      }),
    }),
  );
});

test('should close dialog', async () => {
  const user = userEvent.setup();

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

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: Wrapper },
  );

  await waitFor(() => {
    expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(within(screen.baseElement).queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(createOkResponse({ projects: [] }))
    .mockResolvedValueOnce(createErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: Wrapper },
  );

  await waitFor(() => {
    expect(screen.queryByText('No Projects')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ user: { id: USER.sub } }) }),
  );

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Test Project');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Project' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Project' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('Internal Server Error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/create`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { name: 'Test Project', description: '' },
      }),
    }),
  );
});
