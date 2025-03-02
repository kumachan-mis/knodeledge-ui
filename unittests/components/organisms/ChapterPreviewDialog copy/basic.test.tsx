import ProjectPreviewDialog from '@/components/organisms/ProjectPreviewDialog';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should submit project', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectPreviewDialog
      onClose={onClose}
      onSubmit={onSubmit}
      open
      project={{
        id: 'PROJECT',
        name: 'Project Name',
      }}
      submitText="Submit"
      title="Submit Project"
    />,
  );

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ProjectPreviewDialog
      onClose={onClose}
      onSubmit={onSubmit}
      open
      project={{
        id: 'PROJECT',
        name: 'Project Name',
      }}
      submitText="Submit"
      title="Submit Project"
    />,
  );

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('should show error when failed to submit project', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { message: 'root error', user: {}, project: {} },
  });
  const onClose = jest.fn();

  const screen = render(
    <ProjectPreviewDialog
      onClose={onClose}
      onSubmit={onSubmit}
      open
      project={{
        id: 'PROJECT',
        name: 'Project Name',
      }}
      submitText="Submit"
      title="Submit Project"
    />,
  );

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
