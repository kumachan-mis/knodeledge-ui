import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import SectionView from '@/components/organisms/SectionView';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { GraphContextProvider, useInitGraph } from '@/contexts/graphs';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider>
      <ChapterListContextProvider>
        <GraphContextProvider>
          <HooksWrapper>{children}</HooksWrapper>
        </GraphContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitProject(USER.sub, 'PROJECT');
  useInitChapterList(USER.sub, 'PROJECT');
  useInitGraph(USER.sub, 'PROJECT', 'CHAPTER', 'SECTION');

  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show graph paragraph from Graph Find API', async () => {
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
            id: 'CHAPTER',
            name: 'Chapter Name',
            number: 1,
            sections: [
              {
                id: 'SECTION',
                name: 'Section Name',
              },
            ],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          paragraph: 'Graph Paragraph',
        },
      }),
    );

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Graph Paragraph');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(3);
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
  expect(global.fetch).toHaveBeenNthCalledWith(
    3,
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
});

test.each<{
  name: string;
  projectFindResponse: Partial<Response>;
  chaptersListResponse: Partial<Response>;
  graphFindResponse: Partial<Response>;
}>([
  {
    name: 'Project Find API',
    projectFindResponse: createNotFoundResponse({ message: 'not found' }),
    chaptersListResponse: createOkResponse({
      chapters: [
        {
          id: 'CHAPTER',
          name: 'Chapter Name',
          number: 1,
          sections: [
            {
              id: 'SECTION',
              name: 'Section Name',
            },
          ],
        },
      ],
    }),
    graphFindResponse: createOkResponse({
      graph: {
        id: 'SECTION',
        content: 'Graph Paragraph',
      },
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
    chaptersListResponse: createNotFoundResponse({ message: 'not found' }),
    graphFindResponse: createOkResponse({
      graph: {
        id: 'GRAPH',
        content: 'Graph Paragraph',
      },
    }),
  },
  {
    name: 'Graph Find API',
    projectFindResponse: createOkResponse({
      project: {
        id: 'PROJECT',
        name: 'Project Name',
        description: 'Project Description',
      },
    }),
    chaptersListResponse: createOkResponse({
      chapters: [
        {
          id: 'CHAPTER',
          name: 'Chapter Name',
          number: 1,
          sections: [
            {
              id: 'SECTION',
              name: 'Section Name',
            },
          ],
        },
      ],
    }),
    graphFindResponse: createNotFoundResponse({ message: 'not found' }),
  },
  {
    name: 'All APIs ',
    projectFindResponse: createNotFoundResponse({ message: 'not found' }),
    chaptersListResponse: createNotFoundResponse({ message: 'not found' }),
    graphFindResponse: createNotFoundResponse({ message: 'not found' }),
  },
])(
  'should show nothing when not found error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse, graphFindResponse }) => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(projectFindResponse)
      .mockResolvedValueOnce(chaptersListResponse)
      .mockResolvedValueOnce(graphFindResponse);

    const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Section Name')).not.toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(3);
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
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
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
  },
);

test.each<{
  name: string;
  projectFindResponse: Partial<Response>;
  chaptersListResponse: Partial<Response>;
  graphFindResponse: Partial<Response>;
}>([
  {
    name: 'Project Find API',
    projectFindResponse: createInternalErrorResponse({ message: 'internal error' }),
    chaptersListResponse: createOkResponse({
      chapters: [
        {
          id: 'CHAPTER',
          name: 'Chapter Name',
          number: 1,
          sections: [
            {
              id: 'SECTION',
              name: 'Section Name',
            },
          ],
        },
      ],
    }),
    graphFindResponse: createOkResponse({
      graph: {
        id: 'GRAPH',
        content: 'Graph Paragraph',
      },
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
    chaptersListResponse: createInternalErrorResponse({ message: 'internal error' }),
    graphFindResponse: createOkResponse({
      graph: {
        id: 'GRAPH',
        content: 'Graph Paragraph',
      },
    }),
  },
  {
    name: 'Graph Find API',
    projectFindResponse: createOkResponse({
      project: {
        id: 'PROJECT',
        name: 'Project Name',
        description: 'Project Description',
      },
    }),
    chaptersListResponse: createOkResponse({
      chapters: [
        {
          id: 'GRAPH',
          name: 'Chapter Name',
          number: 1,
          sections: [
            {
              id: 'SECTION',
              name: 'Section Name',
            },
          ],
        },
      ],
    }),
    graphFindResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
  {
    name: 'All APIs',
    projectFindResponse: createInternalErrorResponse({ message: 'internal error' }),
    chaptersListResponse: createInternalErrorResponse({ message: 'internal error' }),
    graphFindResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
])(
  'should show error message when internal error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse, graphFindResponse }) => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(projectFindResponse)
      .mockResolvedValueOnce(chaptersListResponse)
      .mockResolvedValueOnce(graphFindResponse);

    const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
    });
    expect(screen.getByText('internal error')).toBeInTheDocument();

    expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Section Name')).not.toBeInTheDocument();
    expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(3);
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
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
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
  },
);
