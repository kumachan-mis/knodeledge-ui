import ChapterListItem from '@/components/organisms/top/ChapterListItem';

import { render } from '@testing-library/react';

test('should show chapter', () => {
  const updateChapter = jest.fn();

  const screen = render(
    <ChapterListItem
      chapter={{
        id: 'CHAPTER',
        name: 'Chapter Name',
        number: 1,
      }}
      maxChapterNumber={3}
      onUpdateChapter={updateChapter}
    />,
  );

  expect(screen.queryByText('CHAPTER')).not.toBeInTheDocument();
  expect(screen.queryByText('#1 Chapter Name')).toBeInTheDocument();
  expect(screen.queryByLabelText('chapter menu')).toBeInTheDocument();
});
