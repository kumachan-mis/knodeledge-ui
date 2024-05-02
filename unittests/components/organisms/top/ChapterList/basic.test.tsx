import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../../testutils/fetch';
import { USER } from '../../../../testutils/user';
import PanicError from '@/components/organisms/error/PanicError';
import ChapterList from '@/components/organisms/top/ChapterList';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';

import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ChapterListContextProvider>
      <HooksWrapper>{children}</HooksWrapper>
    </ChapterListContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitChapterList({ id: USER.sub }, { id: 'PROJECT' });
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show chapter from Chapter List API', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createOkResponse({
      chapters: [
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
      ],
    }),
  );

  const screen = render(<ChapterList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('#1 Chapter One')).toBeInTheDocument();
  });
  expect(screen.getByText('#2 Chapter Two')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show nothing when not foud error occured', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'Not Found' }));

  const screen = render(<ChapterList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
  expect(screen.queryByText('Not Found')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});

test('should show error message when internal error occured', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'Internal Server Error' }));

  const screen = render(<ChapterList user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/list`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' } }),
    }),
  );
});
