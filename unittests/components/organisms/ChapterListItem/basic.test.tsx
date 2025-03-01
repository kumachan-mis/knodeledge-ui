import { USER } from '../../../testutils/user';
import ChapterListItem from '@/components/organisms/ChapterListItem';
import SectionList from '@/components/organisms/SectionList';

import { render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should show chapter', () => {
  const updateChapter = jest.fn();
  const deleteChapter = jest.fn();

  const screen = render(
    <ChapterListItem
      SectionList={(props) => <SectionList {...props} user={USER} />}
      chapter={{
        id: 'CHAPTER',
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

  expect(screen.queryByText('CHAPTER')).not.toBeInTheDocument();
  expect(screen.queryByText('#1 Chapter Name')).toBeInTheDocument();
  expect(screen.queryByLabelText('chapter menu')).toBeInTheDocument();
});

test('should show chapter menu', async () => {
  const user = userEvent.setup();

  const updateChapter = jest.fn();
  const deleteChapter = jest.fn();

  const screen = render(
    <ChapterListItem
      SectionList={(props) => <SectionList {...props} user={USER} />}
      chapter={{
        id: 'CHAPTER',
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

  expect(menu.getByRole('link')).toHaveAttribute('href', '/projects/PROJECT?chapter=CHAPTER');
  expect(within(menu.getByRole('link')).getByText('Open Chapter')).toBeInTheDocument();
  expect(menu.getByText('Update Chapter')).toBeInTheDocument();
});
