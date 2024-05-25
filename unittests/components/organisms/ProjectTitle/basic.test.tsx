import ProjectTitle from '@/components/organisms/ProjectTitle';

import { render } from '@testing-library/react';

test('should show title string', () => {
  const screen = render(<ProjectTitle>PROJECTS</ProjectTitle>);
  expect(screen.queryByText('PROJECTS')).toBeInTheDocument();
});
