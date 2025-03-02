import { USER } from '../../../testutils/user';
import ChapterListItem from '@/components/organisms/ChapterListItem';
import SectionList from '@/components/organisms/SectionList';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should delete chapter', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn();
  const deleteChapter = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ChapterListItem
      SectionList={(props) => <SectionList {...props} user={USER} />}
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
        sections: [],
      }}
      maxChapterNumber={3}
      onDeleteChapter={deleteChapter}
      onUpdateChapter={updateChapter}
      projectId="PROJECT"
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Chapter' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(deleteChapter).toHaveBeenCalledTimes(1);

  const chapters = screen.queryAllByRole('listitem');
  expect(chapters.map((chapter) => chapter.textContent)).toEqual([]);
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn();
  const deleteChapter = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <ChapterListItem
      SectionList={(props) => <SectionList {...props} user={USER} />}
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
        sections: [],
      }}
      maxChapterNumber={3}
      onDeleteChapter={deleteChapter}
      onUpdateChapter={updateChapter}
      projectId="PROJECT"
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(deleteChapter).not.toHaveBeenCalled();
});

test('should show error when failed to delete chapter', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn();
  const deleteChapter = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { message: 'root error', user: {}, project: {}, chapter: {} },
  });

  const screen = render(
    <ChapterListItem
      SectionList={(props) => <SectionList {...props} user={USER} />}
      chapter={{
        id: 'CHAPTER_ID',
        name: 'Chapter Name',
        number: 1,
        sections: [],
      }}
      maxChapterNumber={3}
      onDeleteChapter={deleteChapter}
      onUpdateChapter={updateChapter}
      projectId="PROJECT"
    />,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Chapter' }));

  await waitFor(() => {
    expect(dialog.queryByText('root error')).toBeInTheDocument();
  });

  expect(deleteChapter).toHaveBeenCalledTimes(1);
});
