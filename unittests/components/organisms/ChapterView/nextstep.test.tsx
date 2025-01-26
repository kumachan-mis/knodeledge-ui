import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterView from '@/components/organisms/ChapterView';
import PanicError from '@/components/organisms/PanicError';
import { ActiveChapterContextProvider, ChapterListContextProvider } from '@/contexts/openapi/chapters';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { CachedPaperContextProvider, useInitPaper } from '@/contexts/openapi/papers';
import { ProjectContextProvider } from '@/contexts/openapi/projects';
import { ChapterWithSections, Project } from '@/openapi';

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
      <ChapterListContextProvider initialChapterList={chapterList}>
        <CachedPaperContextProvider>
          <HooksWrapper chapterList={chapterList}>{children}</HooksWrapper>
        </CachedPaperContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ chapterList, children }) => {
  useInitPaper(USER.sub, 'PROJECT', 'CHAPTER');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activeChapter = chapterList.find((chapter) => chapter.id === 'CHAPTER')!;

  return <ActiveChapterContextProvider activeChapter={activeChapter}>{children}</ActiveChapterContextProvider>;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should sectionalize paper into graph with Graph Sectionalize API', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      number: 1,
      name: 'Chapter Name',
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: [
            '[** Section 1]',
            'section one text section one text',
            '[** Section 2]',
            'section two text section two text',
            'section two text section two text',
          ].join('\n'),
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graphs: [
          {
            id: 'SECTION_ONE',
            name: 'Section 1',
            paragraph: 'section one text section one text',
            children: [],
          },
          {
            id: 'SECTION_TWO',
            name: 'Section 2',
            paragraph: 'section two text section two text\nsection two text section two text',
            children: [],
          },
        ],
      }),
    );

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent(
      [
        'Section 1',
        'section one text section one text',
        'Section 2',
        'section two text section two text',
        'section two text section two text',
      ].join(' '),
    );
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to Next Step' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );

  await user.click(screen.getByRole('button', { name: 'Go to Next Step' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/sectionalize`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        sections: [
          {
            name: 'Section 1',
            content: 'section one text section one text',
          },
          {
            name: 'Section 2',
            content: 'section two text section two text\nsection two text section two text',
          },
        ],
      }),
    }),
  );
});

test('should show error message when paper sectionalization failed', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      number: 1,
      name: 'Chapter Name',
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: [
            '[** Section 1]',
            'section one text section one text',
            '[** Section 2]',
            'section two text section two text',
            'section two text section two text',
          ].join('\n'),
        },
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({
        user: {},
        project: {},
        chapter: {},
        sections: { message: 'sections error' },
      }),
    );

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent(
      [
        'Section 1',
        'section one text section one text',
        'Section 2',
        'section two text section two text',
        'section two text section two text',
      ].join(' '),
    );
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to Next Step' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );

  await user.click(screen.getByRole('button', { name: 'Go to Next Step' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(dialog.getByText('sections error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/sectionalize`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        sections: [
          {
            name: 'Section 1',
            content: 'section one text section one text',
          },
          {
            name: 'Section 2',
            content: 'section two text section two text\nsection two text section two text',
          },
        ],
      }),
    }),
  );
});

test('should show error message when paper to be sectionalized does not exist', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      number: 1,
      name: 'Chapter Name',
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: [
            '[** Section 1]',
            'section one text section one text',
            '[** Section 2]',
            'section two text section two text',
            'section two text section two text',
          ].join('\n'),
        },
      }),
    )
    .mockResolvedValueOnce(
      createNotFoundResponse({
        message: 'not found',
        user: {},
        project: {},
        chapter: {},
        sections: {},
      }),
    );

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent(
      [
        'Section 1',
        'section one text section one text',
        'Section 2',
        'section two text section two text',
        'section two text section two text',
      ].join(' '),
    );
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to Next Step' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );

  await user.click(screen.getByRole('button', { name: 'Go to Next Step' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(dialog.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/sectionalize`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        sections: [
          {
            name: 'Section 1',
            content: 'section one text section one text',
          },
          {
            name: 'Section 2',
            content: 'section two text section two text\nsection two text section two text',
          },
        ],
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
      id: 'CHAPTER',
      number: 1,
      name: 'Chapter Name',
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: [
            '[** Section 1]',
            'section one text section one text',
            '[** Section 2]',
            'section two text section two text',
            'section two text section two text',
          ].join('\n'),
        },
      }),
    )
    .mockResolvedValueOnce(
      createInternalErrorResponse({
        message: 'internal error',
      }),
    );

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent(
      [
        'Section 1',
        'section one text section one text',
        'Section 2',
        'section two text section two text',
        'section two text section two text',
      ].join(' '),
    );
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to Next Step' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );

  await user.click(screen.getByRole('button', { name: 'Go to Next Step' }));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/sectionalize`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        sections: [
          {
            name: 'Section 1',
            content: 'section one text section one text',
          },
          {
            name: 'Section 2',
            content: 'section two text section two text\nsection two text section two text',
          },
        ],
      }),
    }),
  );
});
