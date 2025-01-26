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
} from '@/contexts/openapi/chapters';
import { CachedGraphContextProvider, useInitGraph } from '@/contexts/openapi/graphs';
import { PanicContextProvider } from '@/contexts/openapi/panic';
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

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalSvgGetClientRect = SVGSVGElement.prototype.getBoundingClientRect;
beforeAll(() => {
  global.fetch = jest.fn();
  Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 }),
  });
  Object.defineProperty(SVGSVGElement.prototype, 'getBoundingClientRect', {
    writable: true,
    value: jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 }),
  });
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

afterAll(() => {
  Object.defineProperty(SVGSVGElement.prototype, 'getBoundingClientRect', {
    writable: true,
    value: originalSvgGetClientRect,
  });
  Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: undefined,
  });
});

test('should update graph paragraph with Graph Update API', async () => {
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
          name: 'Graph',
          paragraph: 'Graph Paragraph',
          children: [],
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          name: 'Graph',
          paragraph: 'Graph Paragraph Updated',
          children: [],
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
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated', children: [] },
      }),
    }),
  );
});

test('should update graph children with Graph Update API', async () => {
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
          name: 'Graph',
          paragraph: '',
          children: [],
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          name: 'Graph',
          paragraph: '#Child_One\n',
          children: [
            {
              name: 'Child One',
              relation: 'Child One Relation',
              description: 'Child One Description',
              children: [],
            },
          ],
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
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent('');
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

  await user.click(screen.getByRole('tab', { name: 'Graph View' }));
  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeInTheDocument();
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  await user.keyboard('#Child_One{enter}');

  const hashtagElements = screen.container.querySelectorAll('[data-styleid="hashtag"]');

  await user.click(hashtagElements[0]);
  await waitFor(() => {
    expect(screen.getByText('Child One')).toBeInTheDocument();
  });

  await user.type(screen.getByLabelText('Relation'), 'Child One Relation');

  await user.click(screen.getByText('Graph'));
  await waitFor(() => {
    expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
  });

  await user.click(screen.getByText('Child One Relation'));
  await waitFor(() => {
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  await user.type(screen.getByLabelText('Description'), 'Child One Description');

  document.elementsFromPoint = originalElementFromPoint;

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
        graph: {
          id: 'GRAPH',
          paragraph: '#Child_One\n',
          children: [
            {
              name: 'Child One',
              relation: 'Child One Relation',
              description: 'Child One Description',
              children: [],
            },
          ],
        },
      }),
    }),
  );
});

test('should update graph grandchildren with Graph Update API', async () => {
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
          name: 'Graph',
          paragraph: '#Child_One\n#Child_Two\n#Child_Three\n',
          children: [
            {
              name: 'Child One',
              relation: 'Child One Relation',
              description: 'Child One Description',
              children: [],
            },
            {
              name: 'Child Two',
              relation: 'Child Two Relation',
              description: 'Child Two Description',
              children: [],
            },
            {
              name: 'Child Three',
              relation: 'Child Three Relation',
              description: 'Child Three Description',
              children: [],
            },
          ],
        },
      }),
    )
    .mockResolvedValueOnce(
      createOkResponse({
        graph: {
          id: 'GRAPH',
          name: 'Graph',
          paragraph: '#Child_One\n#Child_Two\n#Child_Three\n#Grandchild_One\n',
          children: [
            {
              name: 'Child One',
              relation: 'Child One Relation',
              description: 'Child One Description',
              children: [
                {
                  name: 'Grandchild One',
                  relation: 'Grandchild One Relation',
                  description: 'Grandchild One Description',
                  children: [],
                },
              ],
            },
            {
              name: 'Child Two',
              relation: 'Child Two Relation',
              description: 'Child Two Description',
              children: [],
            },
            {
              name: 'Child Three',
              relation: 'Child Three Relation',
              description: 'Child Three Description',
              children: [],
            },
          ],
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
    expect(screen.container.querySelector('[data-selectid="text-field"]')).toHaveTextContent(
      '#Child_One #Child_Two #Child_Three',
    );
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

  await user.click(screen.getByRole('tab', { name: 'Graph View' }));
  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeInTheDocument();
  });

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Child One') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Expand' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalElementFromPoint = document.elementsFromPoint;
  document.elementsFromPoint = jest
    .fn()
    .mockReturnValue([screen.container.querySelector('[data-selectid="text-field"]')]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('[data-selectid="text-field"]')!);

  await user.keyboard('#Grandchild_One{enter}');

  const hashtagElements = screen.container.querySelectorAll('[data-styleid="hashtag"]');

  await user.click(hashtagElements[3]);
  await waitFor(() => {
    expect(screen.getByText('Grandchild One')).toBeInTheDocument();
  });

  await user.type(screen.getByLabelText('Relation'), 'Grandchild One Relation');

  await user.click(screen.getByText('Graph'));
  await waitFor(() => {
    expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
  });

  await user.click(screen.getByText('Grandchild One Relation'));
  await waitFor(() => {
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  await user.type(screen.getByLabelText('Description'), 'Grandchild One Description');

  document.elementsFromPoint = originalElementFromPoint;

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
        graph: {
          id: 'GRAPH',
          paragraph: '#Child_One\n#Child_Two\n#Child_Three\n#Grandchild_One\n',
          children: [
            {
              name: 'Child One',
              relation: 'Child One Relation',
              description: 'Child One Description',
              children: [
                {
                  name: 'Grandchild One',
                  relation: 'Grandchild One Relation',
                  description: 'Grandchild One Description',
                  children: [],
                },
              ],
            },
            {
              name: 'Child Two',
              relation: 'Child Two Relation',
              description: 'Child Two Description',
              children: [],
            },
            {
              name: 'Child Three',
              relation: 'Child Three Relation',
              description: 'Child Three Description',
              children: [],
            },
          ],
        },
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
          name: 'Graph',
          paragraph: 'Graph Paragraph',
          children: [],
        },
      }),
    )
    .mockResolvedValueOnce(
      createBadRequestResponse({
        message: 'invalid request value',
        user: {},
        project: {},
        graph: {
          name: 'name error',
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
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated', children: [] },
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
          name: 'Graph',
          paragraph: 'Graph Paragraph',
          children: [],
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
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated', children: [] },
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
          name: 'Graph',
          paragraph: 'Graph Paragraph',
          children: [],
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
        graph: { id: 'GRAPH', paragraph: 'Graph Paragraph Updated', children: [] },
      }),
    }),
  );
});
