import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
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
    value: jest.fn().mockReturnValue({ x: 0, y: 0, width: 1000, height: 800 }),
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

test('should show graph diagram and paragraph from Graph Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      graph: {
        id: 'GRAPH',
        name: 'Parent Node Name',
        paragraph: 'Graph Paragraph',
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parentNodeGroup = screen.getByText('Parent Node Name').closest('g')!;
  await waitFor(() => {
    const parentNodeCircle = parentNodeGroup.querySelector('circle');
    expect(parentNodeCircle).toHaveAttribute('cx', '500');
    expect(parentNodeCircle).toHaveAttribute('cy', '400');
  });

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
});

test('should show nothing when not found error occured in Graph Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  await waitFor(() => {
    expect(screen.queryByText('Project Name')).toBeInTheDocument();
  });

  expect(screen.queryByText('Chapter Name')).toBeInTheDocument();
  expect(screen.queryByText('Section Name')).toBeInTheDocument();
  expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();

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
});

test('should show error message when internal error occured in Graph Find API', async () => {
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

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<SectionView chapterId="CHAPTER" projectId="PROJECT" sectionId="SECTION" user={USER} />, {
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

  expect(screen.queryByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Chapter Name')).toBeInTheDocument();
  expect(screen.queryByText('Section Name')).toBeInTheDocument();
  expect(screen.container.querySelector('[data-selectid="text-field"]')).not.toBeInTheDocument();

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
});
