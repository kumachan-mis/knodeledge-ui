import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import PanicError from '@/components/organisms/PanicError';
import SectionList from '@/components/organisms/SectionList';
import { CachedGraphContextProvider } from '@/contexts/openapi/graphs';
import { PanicContextProvider } from '@/contexts/openapi/panic';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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

test('should delete section with Graph Delete API', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce(createOkResponse({}));

  const screen = render(
    <SectionList
      chapterId="CHAPTER"
      projectId="PROJECT"
      sections={[
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ]}
      user={USER}
    />,
    { wrapper: Wrapper },
  );

  await user.click(screen.getByLabelText('section menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Section'));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/delete`,
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

test('should show error message when graph to be deleted does not exist', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createNotFoundResponse({ message: 'not found', user: {}, project: {}, chapter: {} }),
  );

  const screen = render(
    <SectionList
      chapterId="CHAPTER"
      projectId="PROJECT"
      sections={[
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ]}
      user={USER}
    />,
    { wrapper: Wrapper },
  );

  await user.click(screen.getByLabelText('section menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Section'));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/delete`,
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

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(
    <SectionList
      chapterId="CHAPTER"
      projectId="PROJECT"
      sections={[
        {
          id: 'SECTION',
          name: 'Section Name',
        },
      ]}
      user={USER}
    />,
    { wrapper: Wrapper },
  );

  await user.click(screen.getByLabelText('section menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Section'));

  await waitFor(() => {
    expect(screen.getByText('internal error')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/graphs/delete`,
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
