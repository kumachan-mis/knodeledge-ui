import SectionListItem from '@/components/organisms/SectionListItem';

import { render } from '@testing-library/react';

test('should show section', () => {
  const screen = render(
    <SectionListItem
      chapterId="CHAPTER"
      projectId="PROJECT"
      section={{
        id: 'SECTION',
        name: 'Section Name',
      }}
    />,
  );

  expect(screen.queryByText('SECTION')).not.toBeInTheDocument();
  expect(screen.queryByText('Section Name')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/PROJECT?chapter=CHAPTER&section=SECTION');
});
