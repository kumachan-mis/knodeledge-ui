import { USER } from '../../../testutils/user';
import ChapterList from '@/components/organisms/ChapterList';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { ChapterWithSections } from '@/openapi';

import { within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ chapterList, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ChapterListContextProvider initialChapterList={chapterList}>{children}</ChapterListContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show chapters', async () => {
  const user = userEvent.setup();

  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER_ONE',
      number: 1,
      name: 'Chapter One',
      sections: [
        {
          id: 'SECTION_ONE',
          name: 'Section One',
        },
        {
          id: 'SECTION_TWO',
          name: 'Section Two',
        },
      ],
    },
    {
      id: 'CHAPTER_TWO',
      number: 2,
      name: 'Chapter Two',
      sections: [
        {
          id: 'SECTION_THREE',
          name: 'Section Three',
        },
        {
          id: 'SECTION_FOUR',
          name: 'Section Four',
        },
      ],
    },
  ];

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => <Wrapper chapterList={chapterList}>{children}</Wrapper>,
  });

  expect(screen.getByText('#1 Chapter One')).toBeInTheDocument();
  expect(screen.getByText('Section One')).toBeInTheDocument();
  expect(screen.getByText('Section Two')).toBeInTheDocument();

  expect(screen.getByText('#2 Chapter Two')).toBeInTheDocument();
  expect(screen.getByText('Section Three')).toBeInTheDocument();
  expect(screen.getByText('Section Four')).toBeInTheDocument();

  await user.click(screen.getAllByLabelText('chapter menu')[0]);

  const menu = within(await screen.findByRole('menu'));

  expect(menu.getByRole('link')).toHaveAttribute('href', '/projects/PROJECT?chapter=CHAPTER_ONE');
  expect(within(menu.getByRole('link')).getByText('Open Chapter')).toBeInTheDocument();
  expect(menu.getByText('Update Chapter')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});
