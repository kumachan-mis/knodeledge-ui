import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import SectionList from '@/components/organisms/SectionList';
import { CachedGraphContextProvider } from '@/contexts/openapi/graphs';
import { PanicContextProvider } from '@/contexts/openapi/panic';

import { render } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <CachedGraphContextProvider>{children}</CachedGraphContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

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
    { wrapper: Wrapper },
  );

  expect(screen.queryByText('SECTION_ONE')).not.toBeInTheDocument();
  expect(screen.queryByText('Section One')).toBeInTheDocument();

  expect(screen.queryByText('SECTION_TWO')).not.toBeInTheDocument();
  expect(screen.queryByText('Section Two')).toBeInTheDocument();
});
