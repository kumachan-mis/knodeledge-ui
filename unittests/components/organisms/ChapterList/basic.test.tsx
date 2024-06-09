import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterList from '@/components/organisms/ChapterList';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider, useInitChapterList } from '@/contexts/chapters';
import { PanicContextProvider } from '@/contexts/panic';

import { waitFor, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <PanicContextProvider>
    <PanicError />
    <ChapterListContextProvider>
      <HooksWrapper>{children}</HooksWrapper>
    </ChapterListContextProvider>
  </PanicContextProvider>
);

const HooksWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useInitChapterList({ id: USER.sub }, 'PROJECT');
  return children;
};

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show chapter from Chapter List API', async () => {
  const user = userEvent.setup();
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

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('#1 Chapter One')).toBeInTheDocument();
  });
  expect(screen.getByText('#2 Chapter Two')).toBeInTheDocument();

  await user.click(screen.getAllByLabelText('chapter menu')[0]);

  const menu = within(await screen.findByRole('menu'));

  expect(menu.getByRole('link')).toHaveAttribute('href', '/projects/PROJECT?chapter=CHAPTER_ONE');
  expect(within(menu.getByRole('link')).getByText('Open Chapter')).toBeInTheDocument();
  expect(menu.getByText('Update Chapter')).toBeInTheDocument();

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

test('should show nothing when not found error occured', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(createNotFoundResponse({ message: 'not found' }));

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
  expect(screen.queryByText('not found')).not.toBeInTheDocument();

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
  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(<ChapterList projectId="PROJECT" user={USER} />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('internal error')).toBeInTheDocument();

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
