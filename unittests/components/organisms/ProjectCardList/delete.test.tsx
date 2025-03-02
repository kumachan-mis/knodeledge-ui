import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import ProjectCardList from '@/components/organisms/ProjectCardList';
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

test('should delete project with Project Delete API', async () => {
  const user = userEvent.setup();

  const projectList: Project[] = [
    {
      id: 'PROJECT',
      name: 'Project Name',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(createOkResponse({}));

  const screen = render(
    <Wrapper projectList={projectList}>
      <ProjectCardList user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Project' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show error message when project to be deleted does not exist', async () => {
  const user = userEvent.setup();

  const projectList: Project[] = [
    {
      id: 'PROJECT',
      name: 'Project Name',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createNotFoundResponse({ message: 'not found', user: {}, project: {}, chapter: {} }),
  );

  const screen = render(
    <Wrapper projectList={projectList}>
      <ProjectCardList user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Project' }));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  const projectList: Project[] = [
    {
      id: 'PROJECT',
      name: 'Project Name',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(
    <Wrapper projectList={projectList}>
      <ProjectCardList user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Project' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});
