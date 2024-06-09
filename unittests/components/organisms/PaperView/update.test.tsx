import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import PaperView from '@/components/organisms/PaperView';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';
import { PaperContextProvider, useInitPaper } from '@/contexts/papers';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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
  useInitProject({ id: USER.sub }, 'PROJECT');
  useInitChapterList({ id: USER.sub }, 'PROJECT');
  useInitPaper({ id: USER.sub }, 'PROJECT', 'CHAPTER');

  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should update project with Project Update API', async () => {
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
    )
    .mockResolvedValueOnce(
      createOkResponse({
        paper: {
          id: 'PAPER',
          content: 'Paper Content Updated',
        },
      }),
    );

  const screen = render(<PaperView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('Chapter Name')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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

  const screen = render(<PaperView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('invalid request value: content error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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
    )
    .mockResolvedValueOnce(
      createNotFoundResponse({
        message: 'not found',
        user: {},
        project: {},
        paper: {},
      }),
    );

  const screen = render(<PaperView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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
    )
    .mockResolvedValueOnce(
      createInternalErrorResponse({
        message: 'internal error',
      }),
    );

  const screen = render(<PaperView chapterId="CHAPTER" projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  document.elementsFromPoint = originalElementFromPoint;

  await user.keyboard(' Updated');

  expect(screen.getByText('Chapter Name *')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.queryByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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
