import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterView from '@/components/organisms/ChapterView';
import PanicError from '@/components/organisms/PanicError';
import { ActiveChapterContextProvider, ChapterListContextProvider } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { CachedPaperContextProvider, useInitPaper } from '@/contexts/papers';
import { ProjectContextProvider } from '@/contexts/projects';
import { ChapterWithSections, Project } from '@/openapi';

import { render, waitFor } from '@testing-library/react';

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

test('should show paper content from Paper Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      paper: {
        id: 'PAPER',
        content: 'Paper Content',
      },
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
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Paper Content');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
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
});

test('should show nothing when not found error occured in Paper Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();
  });

  expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
  expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});

test('should show error message when internal error occured in Paper Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<ChapterView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('internal error')).toBeInTheDocument();

  expect(screen.queryByText('Project Name')).not.toBeInTheDocument();
  expect(screen.queryByText('Chapter Name')).not.toBeInTheDocument();
  expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});
