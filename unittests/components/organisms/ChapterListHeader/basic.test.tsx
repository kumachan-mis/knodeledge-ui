import { USER } from '../../../testutils/user';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider } from '@/contexts/openapi/chapters';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { ProjectContextProvider } from '@/contexts/openapi/projects';
import { ChapterWithSections, Project } from '@/openapi';

import { render } from '@testing-library/react';

const Wrapper: React.FC<{
  project: Project;
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ project, chapterList, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ProjectContextProvider initialProject={project}>
      <ChapterListContextProvider initialChapterList={chapterList}>{children}</ChapterListContextProvider>
    </ProjectContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show project name', () => {
  const project: Project = {
    id: 'PROJECT',
    name: 'Project Name',
    description: 'Project Description',
  };

  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER_ONE',
      number: 1,
      name: 'Chapter One',
      sections: [],
    },
    {
      id: 'CHAPTER_TWO',
      number: 2,
      name: 'Chapter Two',
      sections: [],
    },
  ];

  const screen = render(<ChapterListHeader projectId="PROJECT" user={USER} />, {
    wrapper: ({ children }) => (
      <Wrapper chapterList={chapterList} project={project}>
        {children}
      </Wrapper>
    ),
  });

  expect(screen.getByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(0);
});
