import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import ProjectView from '@/components/organisms/ProjectView';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { ProjectContextProvider } from '@/contexts/openapi/projects';
import { Project } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{
  project: Project;
  children?: React.ReactNode;
}> = ({ project, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider initialProject={project}>{children}</ProjectContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should update project with Project Update API', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      project: {
        id: 'PROJECT',
        name: 'Project Name Updated',
        description: 'Project Description',
      },
    }),
  );

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Project Description')).toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createBadRequestResponse({ user: {}, project: { name: 'name error' } }),
  );

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Project Description')).toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
  };

  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
  };

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<ProjectView user={USER} />, {
    wrapper: ({ children }) => <Wrapper project={project}>{children}</Wrapper>,
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();

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
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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
