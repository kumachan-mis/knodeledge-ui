import ProjectCard from '@/components/organisms/ProjectCard';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should delete project', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn();
  const deleteProject = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ProjectCard
      onDeleteProject={deleteProject}
      onUpdateProject={updateProject}
      project={{
        id: 'PROJECT_ID',
        name: 'Project Name',
      }}
    />,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Project' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(deleteProject).toHaveBeenCalledTimes(1);
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn();
  const deleteProject = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ProjectCard
      onDeleteProject={deleteProject}
      onUpdateProject={updateProject}
      project={{
        id: 'PROJECT_ID',
        name: 'Project Name',
      }}
    />,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(deleteProject).not.toHaveBeenCalled();
});

test('should show error when failed to delete project', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn();
  const deleteProject = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { message: 'root error', user: {}, project: {} },
  });

  const screen = render(
    <ProjectCard
      onDeleteProject={deleteProject}
      onUpdateProject={updateProject}
      project={{
        id: 'PROJECT_ID',
        name: 'Project Name',
      }}
    />,
  );

  await user.click(screen.getByLabelText('delete project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Project' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });

  expect(deleteProject).toHaveBeenCalledTimes(1);
});
