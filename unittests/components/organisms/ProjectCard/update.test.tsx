import ProjectCard from '@/components/organisms/ProjectCard';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should update project', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const deleteProject = jest.fn();

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

  await user.click(screen.getByLabelText('update project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(updateProject).toHaveBeenCalledTimes(1);
  expect(updateProject).toHaveBeenCalledWith({ name: 'Project Name Updated', description: '' });
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const deleteProject = jest.fn();

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

  await user.click(screen.getByLabelText('update project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(updateProject).not.toHaveBeenCalled();
});

test('should show error when failed to update project', async () => {
  const user = userEvent.setup();

  const updateProject = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: {
      message: 'root error',
      user: {},
      project: { name: 'name error', description: 'description error' },
    },
  });
  const deleteProject = jest.fn();

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

  await user.click(screen.getByLabelText('update project'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), ' Updated');
  await user.type(dialog.getByRole('textbox', { name: 'Project Description' }), 'Description');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('name error')).toBeInTheDocument();
  expect(dialog.queryByText('description error')).toBeInTheDocument();

  expect(updateProject).toHaveBeenCalledTimes(1);
  expect(updateProject).toHaveBeenCalledWith({ name: 'Project Name Updated', description: 'Description' });
});
