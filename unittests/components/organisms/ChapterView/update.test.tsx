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

test('should update paper with Paper Update API', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content',
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content Updated',
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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find?userId=${encodeURIComponent(USER.sub)}&projectId=PROJECT&chapterId=CHAPTER`,
    expect.objectContaining({ method: 'GET' }),
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
  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        paper: { id: 'PAPER', content: 'Paper Content Updated' },
      }),
    }),
  );
});

test('should show error message when paper update failed', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content',
        },
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({
        message: 'invalid request value',
        user: {},
        project: {},
        paper: {
          content: 'content error',
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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find?userId=${encodeURIComponent(USER.sub)}&projectId=PROJECT&chapterId=CHAPTER`,
    expect.objectContaining({ method: 'GET' }),
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
  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('invalid request value: content error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        paper: { id: 'PAPER', content: 'Paper Content Updated' },
      }),
    }),
  );
});

test('should show error message when paper to be updated does not exist', async () => {
  const user = userEvent.setup();

  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };
  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content',
        },
      }),
    )
    .mockResolvedValueOnce(
      createNotFoundResponse({
        message: 'not found',
        user: {},
        project: {},
        paper: {},
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

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find?userId=${encodeURIComponent(USER.sub)}&projectId=PROJECT&chapterId=CHAPTER`,
    expect.objectContaining({ method: 'GET' }),
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
  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        paper: { id: 'PAPER', content: 'Paper Content Updated' },
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
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content',
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
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('Paper Content');
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/find?userId=${encodeURIComponent(USER.sub)}&projectId=PROJECT&chapterId=CHAPTER`,
    expect.objectContaining({ method: 'GET' }),
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
  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/papers/update`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        user: { id: USER.sub },
        project: { id: 'PROJECT' },
        paper: { id: 'PAPER', content: 'Paper Content Updated' },
      }),
    }),
  );
});
