import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ChapterList from '@/components/organisms/top/ChapterList';
import ChapterListHeader from '@/components/organisms/top/ChapterListHeader';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';
import { ChapterWithoutAutofield } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider>
      <ChapterListContextProvider>
        <HooksWrapper>{children}</HooksWrapper>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitProject({ id: USER.sub }, 'PROJECT');
  useInitChapterList({ id: USER.sub }, { id: 'PROJECT' });
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project name from Project Find API', async () => {
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    );

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show nothing when not foud error occured', async () => {
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'Not Found' }))
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'Not Found' }));

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
  expect(screen.queryByText('Not Found')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test.each<{
  name: string;
  projectFindResponse: Partial<Response>;
  chaptersListResponse: Partial<Response>;
}>([
  {
    name: 'Project Find API',
    projectFindResponse: createInternalErrorResponse({ message: 'Internal Server Error' }),
    chaptersListResponse: createOkResponse({
      chapters: [
        {
          id: 'CHAPTER_ONE',
          name: 'Chapter One',
          number: 1,
          sections: [],
        },
        {
          id: 'CHAPTER_TWO',
          name: 'Chapter Two',
          number: 2,
          sections: [],
        },
      ],
    }),
  },
  {
    name: 'Chapters List API',
    projectFindResponse: createOkResponse({
      project: {
        id: 'PROJECT',
        name: 'Project Name',
        description: 'Project Description',
      },
    }),
    chaptersListResponse: createInternalErrorResponse({ message: 'Internal Server Error' }),
  },
  {
    name: 'All APIs',
    projectFindResponse: createInternalErrorResponse({ message: 'Internal Server Error' }),
    chaptersListResponse: createInternalErrorResponse({ message: 'Internal Server Error' }),
  },
])(
  'should show error message when internal error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse }) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(projectFindResponse).mockResolvedValueOnce(chaptersListResponse);

    const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
    });
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
      }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
      }),
    );
  },
);

test.each<{
  name: string;
  chapter: ChapterWithoutAutofield;
  expectedChapterTexts: string[];
}>([
  {
    name: 'first chapter',
    chapter: {
      name: 'Chapter',
      number: 1,
    },
    expectedChapterTexts: ['#1 Chapter', '#2 Chapter One', '#3 Chapter Two'],
  },
  {
    name: 'middle chapter',
    chapter: {
      name: 'Chapter',
      number: 2,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Chapter', '#3 Chapter Two'],
  },
  {
    name: 'last chapter',
    chapter: {
      name: 'Chapter',
      number: 3,
    },
    expectedChapterTexts: ['#1 Chapter One', '#2 Chapter Two', '#3 Chapter'],
  },
])('should create a chapter ($name)', async ({ chapter, expectedChapterTexts }) => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapter: {
          id: 'NEW_CHAPTER',
          name: chapter.name,
          number: chapter.number,
          sections: [],
        },
      }),
    );

  const screen = render(
    <div>
      <ChapterListHeader user={USER} />
      <ChapterList />
    </div>,
    { wrapper: Wrapper },
  );

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste(chapter.name);

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste(`${chapter.number}`);

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Chapter' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Chapter' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(global.fetch).toHaveBeenNthCalledWith(
    3,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/create`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter }),
    }),
  );

  const chapters = screen.getAllByRole('listitem');
  expect(chapters.map((chapter) => chapter.textContent)).toEqual(expectedChapterTexts);
});

test('should disable submission when chapter number is too large', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    );

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Test Chapter');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('3');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Chapter' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('4');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Chapter' })).toBeDisabled();
  });

  expect(dialog.queryByText('chapter number is too large')).toBeInTheDocument();
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    );

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('should show error message when chapter creation failed', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({
        user: {},
        project: {},
        chapter: {
          name: 'name error',
          number: 'number error',
        },
      }),
    );

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Test Chapter');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('3');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Chapter' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Chapter' }));

  await waitFor(() => {
    expect(dialog.queryByText('name error')).toBeInTheDocument();
  });
  expect(dialog.queryByText('number error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(global.fetch).toHaveBeenNthCalledWith(
    3,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/create`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { name: 'Test Chapter', number: 3 },
      }),
    }),
  );
});

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        project: {
          id: 'PROJECT',
          name: 'Project Name',
          description: 'Project Description',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        chapters: [
          {
            id: 'CHAPTER_ONE',
            name: 'Chapter One',
            number: 1,
            sections: [],
          },
          {
            id: 'CHAPTER_TWO',
            name: 'Chapter Two',
            number: 2,
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ChapterListHeader user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Test Chapter');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('3');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Create Chapter' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Create Chapter' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('Internal Server Error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(global.fetch).toHaveBeenNthCalledWith(
    3,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/create`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { name: 'Test Chapter', number: 3 },
      }),
    }),
  );
});
