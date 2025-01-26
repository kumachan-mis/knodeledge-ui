import { createBadRequestResponse, createInternalErrorResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import ProjectCardList from '@/components/organisms/ProjectCardList';
import ProjectToolbar from '@/components/organisms/ProjectToolbar';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { ProjectListContextProvider } from '@/contexts/openapi/projects';
import { Project } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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

test('should create a project', async () => {
  const user = userEvent.setup();

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

  (global.fetch as jest.Mock).mockResolvedValueOnce(
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
    { wrapper: ({ children }) => <Wrapper projectList={projectList}>{children}</Wrapper> },
  );

  expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Test Project');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Project' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Project' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.queryByText('Test Project')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: ({ children }) => <Wrapper projectList={projectList}>{children}</Wrapper> },
  );

  await waitFor(() => {
    expect(screen.queryByText('Project Without Description')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project With Description')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should show error message when project creation failed', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createBadRequestResponse({
      user: {},
      project: {
        name: 'name error',
        description: 'description error',
      },
    }),
  );

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: ({ children }) => <Wrapper projectList={[]}>{children}</Wrapper> },
  );

  expect(screen.queryByText('No Projects')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Test Project');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Project' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Project' }));

  await waitFor(() => {
    expect(dialog.queryByText('name error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('description error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(
    <div>
      <ProjectToolbar user={USER} />
      <ProjectCardList user={USER} />
    </div>,
    { wrapper: ({ children }) => <Wrapper projectList={[]}>{children}</Wrapper> },
  );

  expect(screen.queryByText('No Projects')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'New Project' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Test Project');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Project' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Project' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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
