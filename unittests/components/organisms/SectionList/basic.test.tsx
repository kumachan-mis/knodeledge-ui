import { USER } from '../../../testutils/user';
import SectionList from '@/components/organisms/SectionList';

import { render } from '@testing-library/react';

test('should show sections', () => {
  const screen = render(
    <SectionList
      chapterId="CHAPTER"
      projectId="PROJECT"
      sections={[
        {
          id: 'SECTION_ONE',
          name: 'Section One',
        },
        {
          id: 'SECTION_TWO',
          name: 'Section Two',
        },
      ]}
      user={USER}
    />,
  );

  expect(screen.queryByText('SECTION_ONE')).not.toBeInTheDocument();
  expect(screen.queryByText('Section One')).toBeInTheDocument();

  expect(screen.queryByText('SECTION_TWO')).not.toBeInTheDocument();
  expect(screen.queryByText('Section Two')).toBeInTheDocument();
});
