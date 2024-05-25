import ProjectCard from '@/components/organisms/ProjectCard';

import { render } from '@testing-library/react';

test('should show project with description', () => {
  const updateProject = jest.fn();

  const screen = render(
    <ProjectCard
      onUpdateProject={updateProject}
      project={{
        id: 'PROJECT_ID',
        name: 'Project Name',
        description: 'Project Description',
      }}
    />,
  );

  expect(screen.queryByText('PROJECT_ID')).not.toBeInTheDocument();
  expect(screen.queryByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByText('Project Description')).toBeInTheDocument();
  expect(screen.queryByLabelText('update project')).toBeInTheDocument();
});

test('should show project without description', () => {
  const updateProject = jest.fn();

  const screen = render(
    <ProjectCard
      onUpdateProject={updateProject}
      project={{
        id: 'PROJECT_ID',
        name: 'Project Name',
      }}
    />,
  );

  expect(screen.queryByText('PROJECT_ID')).not.toBeInTheDocument();
  expect(screen.queryByText('Project Name')).toBeInTheDocument();
  expect(screen.queryByLabelText('update project')).toBeInTheDocument();
});
