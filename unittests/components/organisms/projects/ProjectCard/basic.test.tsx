import ProjectCard from '@/components/organisms/list/ProjectCard';

import { render } from '@testing-library/react';

test('should show project with description', () => {
  const screen = render(
    <ProjectCard
      loadableProject={{
        data: {
          id: 'PROJECT_ID',
          name: 'Project Name',
          description: 'Project Description',
        },
        error: null,
        state: 'success',
      }}
    />,
  );

  expect(screen.queryByText('PROJECT_ID')).not.toBeInTheDocument();
  expect(screen.queryByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();
});

test('should show project without description', () => {
  const screen = render(
    <ProjectCard
      loadableProject={{
        data: {
          id: 'PROJECT_ID',
          name: 'Project Name',
        },
        error: null,
        state: 'success',
      }}
    />,
  );

  expect(screen.queryByText('PROJECT_ID')).not.toBeInTheDocument();
  expect(screen.queryByText('Project Name')).toBeInTheDocument();
});
