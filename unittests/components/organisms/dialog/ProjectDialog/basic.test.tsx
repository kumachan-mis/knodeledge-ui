import { generateRandomString } from '../../../../testutils/string';
import ProjectDialog from '@/components/organisms/dialog/ProjectDialog';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should render project dialog', async () => {
  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  expect(dialog.queryByText('Project Dialog Title')).toBeInTheDocument();
  expect(dialog.queryByRole('textbox', { name: 'Project Name' })).toHaveValue('');
  expect(dialog.queryByRole('textbox', { name: 'Project Description' })).toHaveValue('');
  expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  expect(dialog.queryByRole('button', { name: 'Close' })).toBeEnabled();
});

test.each<{ name: string; projectName: string }>([
  {
    name: 'common case',
    projectName: 'Project Name',
  },
  {
    name: 'max length',
    projectName: generateRandomString(100),
  },
])('should create project without description ($name)', async ({ projectName }) => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste(projectName);

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenNthCalledWith(1, { name: projectName, description: '' });

  expect(onClose).toHaveBeenNthCalledWith(1);
});

test.each<{ name: string; projectName: string; projectDescription: string }>([
  {
    name: 'common case',
    projectName: 'Project Name',
    projectDescription: 'Project Description',
  },
  {
    name: 'max length',
    projectName: generateRandomString(100),
    projectDescription: generateRandomString(400),
  },
])('should create project with description ($name)', async ({ projectName, projectDescription }) => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste(projectName);

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste(projectDescription);

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenNthCalledWith(1, { name: projectName, description: projectDescription });

  expect(onClose).toHaveBeenNthCalledWith(1);
});

test('should not submit if project name is empty', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Project Name');

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Project Description');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.cut();

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});

test('should not submit if project name is too long', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste(generateRandomString(100));

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Project Description');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Project Name' }), 'x');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});

test('should not submit if project description is too long', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Project Name');

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste(generateRandomString(400));

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Project Description' }), 'x');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});

test('should show error mmessages if project creation fails', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { name: 'project name error', description: 'project description error' },
  });
  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={onSubmit} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Project Name' }));
  await user.paste('Project Name');

  await user.click(dialog.getByRole('textbox', { name: 'Project Description' }));
  await user.paste('Project Description');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenNthCalledWith(1, { name: 'Project Name', description: 'Project Description' });
  expect(onClose).not.toHaveBeenCalled();

  expect(dialog.queryByText('project name error')).toBeInTheDocument();
  expect(dialog.queryByText('project description error')).toBeInTheDocument();
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const onClose = jest.fn();

  const screen = render(
    <ProjectDialog onClose={onClose} onSubmit={jest.fn()} open submitText="Submit" title="Project Dialog Title" />,
  );
  const dialog = within(await within(screen.baseElement).findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
