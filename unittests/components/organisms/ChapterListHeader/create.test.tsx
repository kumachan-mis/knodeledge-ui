import { createBadRequestResponse, createInternalErrorResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterList from '@/components/organisms/ChapterList';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider } from '@/contexts/projects';
import { ChapterWithoutAutofield, ChapterWithSections, Project } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{
  project: Project;
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ project, chapterList, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider initialProject={project}>
      <ChapterListContextProvider initialChapterList={chapterList}>{children}</ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

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

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
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
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(
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
      <ChapterListHeader projectId="PROJECT" user={USER} />
      <ChapterList projectId="PROJECT" user={USER} />
    </div>,
    {
      wrapper: ({ children }) => (
        <Wrapper chapterList={chapterList} project={project}>
          {children}
        </Wrapper>
      ),
    },
  );

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
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
  ];

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
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
  ];

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  await user.click(screen.getByLabelText('new chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should show error message when chapter creation failed', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
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
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createBadRequestResponse({
      user: {},
      project: {},
      chapter: {
        name: 'name error',
        number: 'number error',
      },
    }),
  );

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
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
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

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
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
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
