import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';

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

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

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
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }))
    .mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
  expect(screen.queryByText('not found')).not.toBeInTheDocument();

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
    projectFindResponse: createInternalErrorResponse({ message: 'internal error' }),
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
    chaptersListResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
  {
    name: 'All APIs',
    projectFindResponse: createInternalErrorResponse({ message: 'internal error' }),
    chaptersListResponse: createInternalErrorResponse({ message: 'internal error' }),
  },
])(
  'should show error message when internal error occured ($name)',
  async ({ projectFindResponse, chaptersListResponse }) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(projectFindResponse).mockResolvedValueOnce(chaptersListResponse);

    const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
    });
    expect(screen.getByText('internal error')).toBeInTheDocument();

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
