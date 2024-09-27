import {
  createBadRequestResponse,
  createInternalErrorResponse,
  createNotFoundResponse,
  createOkResponse,
} from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import SectionView from '@/components/organisms/SectionView';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { GraphContextProvider, useInitGraph } from '@/contexts/graphs';
import { PanicContextProvider } from '@/contexts/panic';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';

import { render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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

test('should update graph with Graph Update API', async () => {
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

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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
    )
    .mockResolvedValueOnce(
      createInternalErrorResponse({
        message: 'internal error',
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

  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(global.fetch).toHaveBeenNthCalledWith(
    4,
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
