import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterList from '@/components/organisms/ChapterList';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { Chapter } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ChapterListContextProvider>
      <HooksWrapper>{children}</HooksWrapper>
    </ChapterListContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitChapterList({ id: USER.sub }, { id: 'PROJECT' });
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test.each<{
  name: string;
  chapterIndex: number;
  updatedChapter: Chapter;
  expectedChapterTexts: string[];
}>([
  {
    name: 'first chapter to first chapter',
    chapterIndex: 0,
    updatedChapter: {
      id: 'CHAPTER_ONE',
      name: 'Updated Chapter',
      number: 1,
    },
    expectedChapterTexts: ['#1 Updated Chapter', '#2 Chapter Two', '#3 Chapter Three'],
  },
  {
    name: 'first chapter to middle chapter',
    chapterIndex: 0,
    updatedChapter: {
      id: 'CHAPTER_ONE',
      name: 'Updated Chapter',
      number: 2,
    },
    expectedChapterTexts: ['#1 Chapter Two', '#2 Updated Chapter', '#3 Chapter Three'],
  },
  {
    name: 'first chapter to last chapter',
    chapterIndex: 0,
    updatedChapter: {
      id: 'CHAPTER_ONE',
      name: 'Updated Chapter',
      number: 3,
    },
    expectedChapterTexts: ['#1 Chapter Two', '#2 Chapter Three', '#3 Updated Chapter'],
  },
  {
    name: 'middle chapter to first chapter',
    chapterIndex: 1,
    updatedChapter: {
      id: 'CHAPTER_TWO',
      name: 'Updated Chapter',
      number: 1,
    },
    expectedChapterTexts: ['#1 Updated Chapter', '#2 Chapter One', '#3 Chapter Three'],
  },
  {
    name: 'middle chapter to middle chapter',
    chapterIndex: 1,
    updatedChapter: {
      id: 'CHAPTER_TWO',
      name: 'Updated Chapter',
      number: 2,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Updated Chapter', '#3 Chapter Three'],
  },
  {
    name: 'middle chapter to last chapter',
    chapterIndex: 1,
    updatedChapter: {
      id: 'CHAPTER_TWO',
      name: 'Updated Chapter',
      number: 3,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Chapter Three', '#3 Updated Chapter'],
  },
  {
    name: 'last chapter to first chapter',
    chapterIndex: 2,
    updatedChapter: {
      id: 'CHAPTER_THREE',
      name: 'Updated Chapter',
      number: 1,
    },
    expectedChapterTexts: ['#1 Updated Chapter', '#2 Chapter One', '#3 Chapter Two'],
  },
  {
    name: 'last chapter to middle chapter',
    chapterIndex: 2,
    updatedChapter: {
      id: 'CHAPTER_THREE',
      name: 'Updated Chapter',
      number: 2,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Updated Chapter', '#3 Chapter Two'],
  },
  {
    name: 'last chapter to last chapter',
    chapterIndex: 2,
    updatedChapter: {
      id: 'CHAPTER_THREE',
      name: 'Updated Chapter',
      number: 3,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Chapter Two', '#3 Updated Chapter'],
  },
])(
  'should update chapter with Chapter Update API ($name)',
  async ({ chapterIndex, updatedChapter, expectedChapterTexts }) => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(
        createOkResponse({
          chapters: [
            {
              id: 'CHAPTER_ONE',
              number: 1,
              name: 'Chapter One',
              sections: [],
            },
            {
              id: 'CHAPTER_TWO',
              number: 2,
              name: 'Chapter Two',
              sections: [],
            },
            {
              id: 'CHAPTER_THREE',
              number: 3,
              name: 'Chapter Three',
              sections: [],
            },
          ],
        }),
      )
      .mockResolvedValueOnce(createOkResponse({ chapter: { ...updatedChapter, sections: [] } }));

    const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.queryByText('#1 Chapter One')).toBeInTheDocument();
    });
    expect(screen.queryByText('#2 Chapter Two')).toBeInTheDocument();
    expect(screen.queryByText('#3 Chapter Three')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
      }),
    );

    await user.click(screen.getAllByLabelText('chapter menu')[chapterIndex]);

    const menu = within(await screen.findByRole('menu'));

    await user.click(menu.getByText('Update Chapter'));

    const dialog = within(await screen.findByRole('dialog'));

    await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Name' }));
    await user.paste(updatedChapter.name);

    await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Number' }));
    await user.paste(`${updatedChapter.number}`);

    await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.keyboard('{escape}');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/update`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: updatedChapter }),
      }),
    );

    const chapters = screen.getAllByRole('listitem');
    expect(chapters.map((chapter) => chapter.textContent)).toEqual(expectedChapterTexts);
  },
);

test('should show error message when chapter update failed', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            number: 1,
            name: 'Chapter One',
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            number: 2,
            name: 'Chapter Two',
            sections: [],
          },
          {
            id: 'CHAPTER_THREE',
            number: 3,
            name: 'Chapter Three',
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({ user: {}, project: {}, chapter: { name: 'name error', number: 'number error' } }),
    );

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('#1 Chapter One')).toBeInTheDocument();
  });
  expect(screen.queryByText('#2 Chapter Two')).toBeInTheDocument();
  expect(screen.queryByText('#3 Chapter Three')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getAllByLabelText('chapter menu')[0]);

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), ' Updated');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('name error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('number error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER_ONE', name: 'Chapter One Updated', number: 1 },
      }),
    }),
  );
});

test('should show error message when chapter to be updated does not exist', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            number: 1,
            name: 'Chapter One',
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            number: 2,
            name: 'Chapter Two',
            sections: [],
          },
          {
            id: 'CHAPTER_THREE',
            number: 3,
            name: 'Chapter Three',
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'not found', user: {}, project: {}, chapter: {} }));

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('#1 Chapter One')).toBeInTheDocument();
  });
  expect(screen.queryByText('#2 Chapter Two')).toBeInTheDocument();
  expect(screen.queryByText('#3 Chapter Three')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getAllByLabelText('chapter menu')[0]);

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), ' Updated');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(dialog.queryByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER_ONE', name: 'Chapter One Updated', number: 1 },
      }),
    }),
  );
});

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            number: 1,
            name: 'Chapter One',
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            number: 2,
            name: 'Chapter Two',
            sections: [],
          },
          {
            id: 'CHAPTER_THREE',
            number: 3,
            name: 'Chapter Three',
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.queryByText('#1 Chapter One')).toBeInTheDocument();
  });
  expect(screen.queryByText('#2 Chapter Two')).toBeInTheDocument();
  expect(screen.queryByText('#3 Chapter Three')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getAllByLabelText('chapter menu')[0]);

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Update Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), ' Updated');

  await user.click(dialog.getByRole('button', { name: 'Save Changes' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER_ONE', name: 'Chapter One Updated', number: 1 },
      }),
    }),
  );
});
