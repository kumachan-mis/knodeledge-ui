import ChapterPreviewDialog from '@/components/organisms/ChapterPreviewDialog';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should submit chapter', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterPreviewDialog
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Submit Chapter"
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
    <ChapterPreviewDialog
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Submit Chapter"
    />,
  );

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('should show error when failed to submit chapter', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { message: 'root error', user: {}, project: {}, chapter: {} },
  });
  const onClose = jest.fn();

  const screen = render(
    <ChapterPreviewDialog
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Submit Chapter"
    />,
  );

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
