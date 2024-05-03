import ChapterListItem from '@/components/organisms/top/ChapterListItem';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should update chapter', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ChapterListItem
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      maxChapterNumber={3}
      onUpdateChapter={updateChapter}
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), ' Updated');
  await user.type(dialog.getByRole('textbox', { name: 'Chapter Number' }), '{backspace}2');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(updateChapter).toHaveBeenCalledTimes(1);
  expect(updateChapter).toHaveBeenCalledWith({ name: 'Chapter Name Updated', number: 2 });
});

test('should close dialog to update chapter', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ChapterListItem
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      maxChapterNumber={3}
      onUpdateChapter={updateChapter}
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(updateChapter).not.toHaveBeenCalled();
});

test('should show error when failed to update chapter', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: {
      message: 'root error',
      user: {},
      project: {},
      chapter: { name: 'name error', number: 'number error' },
    },
  });

  const screen = render(
    <ChapterListItem
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
      }}
      maxChapterNumber={3}
      onUpdateChapter={updateChapter}
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), ' Updated');
  await user.type(dialog.getByRole('textbox', { name: 'Chapter Number' }), '{backspace}2');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('name error')).toBeInTheDocument();
  expect(dialog.queryByText('number error')).toBeInTheDocument();

  expect(updateChapter).toHaveBeenCalledTimes(1);
  expect(updateChapter).toHaveBeenCalledWith({ name: 'Chapter Name Updated', number: 2 });
});
