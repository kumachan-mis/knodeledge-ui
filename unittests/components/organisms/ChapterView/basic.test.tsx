import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterView from '@/components/organisms/ChapterView';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { PaperContextProvider, useInitPaper } from '@/contexts/papers';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider>
      <ChapterListContextProvider>
        <PaperContextProvider>
          <HooksWrapper>{children}</HooksWrapper>
        </PaperContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitProject(USER.sub, 'PROJECT');
  useInitChapterList(USER.sub, 'PROJECT');
  useInitPaper(USER.sub, 'PROJECT', 'CHAPTER');

  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show paper content from Paper Find API', async () => {
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
            sections: [],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content',
        },
      }),
    );

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Paper Content');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
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
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});

test.each<{
  name: string;
  projectFindResponse: Partial<Response>;
  chaptersListResponse: Partial<Response>;
  paperFindResponse: Partial<Response>;
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
          sections: [],
        },
      ],
    }),
    paperFindResponse: createOkResponse({
      paper: {
        id: 'PAPER',
        content: 'Paper Content',
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
    paperFindResponse: createOkResponse({
      paper: {
        id: 'PAPER',
        content: 'Paper Content',
      },
    }),
  },
  {
    name: 'Paper Find API',
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
          sections: [],
        },
      ],
    }),
    paperFindResponse: createNotFoundResponse({ message: 'not found' }),
  },
  {
    name: 'All APIs ',
    projectFindResponse: createNotFoundResponse({ message: 'not found' }),
    chaptersListResponse: createNotFoundResponse({ message: 'not found' }),
    paperFindResponse: createNotFoundResponse({ message: 'not found' }),
  },
])(
  'should show nothing when not found error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse, paperFindResponse }) => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(projectFindResponse)
      .mockResolvedValueOnce(chaptersListResponse)
      .mockResolvedValueOnce(paperFindResponse);

    const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();

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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
      }),
    );
  },
);

test.each<{
  name: string;
  projectFindResponse: Partial<Response>;
  chaptersListResponse: Partial<Response>;
  paperFindResponse: Partial<Response>;
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
          sections: [],
        },
      ],
    }),
    paperFindResponse: createOkResponse({
      paper: {
        id: 'PAPER',
        content: 'Paper Content',
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
    paperFindResponse: createOkResponse({
      paper: {
        id: 'PAPER',
        content: 'Paper Content',
      },
    }),
  },
  {
    name: 'Paper Find API',
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
          sections: [],
        },
      ],
    }),
    paperFindResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
  {
    name: 'All APIs',
    projectFindResponse: createInternalErrorResponse({ message: 'internal error' }),
    chaptersListResponse: createInternalErrorResponse({ message: 'internal error' }),
    paperFindResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
])(
  'should show error message when internal error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse, paperFindResponse }) => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(projectFindResponse)
      .mockResolvedValueOnce(chaptersListResponse)
      .mockResolvedValueOnce(paperFindResponse);

    const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
    });
    expect(screen.getByText('internal error')).toBeInTheDocument();

    expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();
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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
      }),
    );
  },
);
