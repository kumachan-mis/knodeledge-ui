import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import SectionView from '@/components/organisms/SectionView';
import {
  ActiveChapterContextProvider,
  ActiveSectionContextProvider,
  ChapterListContextProvider,
} from '@/contexts/chapters';
import { CachedGraphContextProvider, useInitGraph } from '@/contexts/graphs';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider } from '@/contexts/projects';
import { ChapterWithSections, Project } from '@/openapi';

import { render, waitFor } from '@testing-library/react';
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
        <CachedGraphContextProvider>
          <HooksWrapper chapterList={chapterList}>{children}</HooksWrapper>
        </CachedGraphContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ chapterList, children }) => {
  useInitGraph(USER.sub, 'PROJECT', 'CHAPTER', 'SECTION');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activeChapter = chapterList.find((chapter) => chapter.id === 'CHAPTER')!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activeSection = activeChapter.sections.find((section) => section.id === 'SECTION')!;

  return (
    <ActiveChapterContextProvider activeChapter={activeChapter}>
      <ActiveSectionContextProvider activeSection={activeSection}>{children}</ActiveSectionContextProvider>
    </ActiveChapterContextProvider>
  );
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should update graph with Graph Update API', async () => {
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
      sections: [
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph Updated',
        },
      }),
    );

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Graph Paragraph');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        section: { id: 'SECTION' },
      }),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('Section Name')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated' },
      }),
    }),
  );
});

test('should show error message when graph update failed', async () => {
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
      sections: [
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph',
        },
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({
        message: 'invalid request value',
        user: {},
        project: {},
        graph: {
          paragraph: 'paragraph error',
        },
      }),
    );

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Graph Paragraph');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        section: { id: 'SECTION' },
      }),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('invalid request value: paragraph error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated' },
      }),
    }),
  );
});

test('should show error message when graph to be updated does not exist', async () => {
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
      sections: [
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph',
        },
      }),
    )
    .mockResolvedValueOnce(
      createNotFoundResponse({
        message: 'not found',
        user: {},
        project: {},
        graph: {},
      }),
    );

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Graph Paragraph');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        section: { id: 'SECTION' },
      }),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated' },
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
      sections: [
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph',
        },
      }),
    )
    .mockResolvedValueOnce(
      createInternalErrorResponse({
        message: 'internal error',
      }),
    );

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Graph Paragraph');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        section: { id: 'SECTION' },
      }),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        chapter: { id: 'CHAPTER' },
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated' },
      }),
    }),
  );
});
