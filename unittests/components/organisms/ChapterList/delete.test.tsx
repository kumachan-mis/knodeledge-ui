import { createInternalErrorResponse, createNotFoundResponse, createOkResponse } from '../../../testutils/fetch';
import { USER } from '../../../testutils/user';
import ChapterList from '@/components/organisms/ChapterList';
import PanicError from '@/components/organisms/PanicError';
import { ChapterListContextProvider } from '@/contexts/openapi/chapters';
import { PanicContextProvider } from '@/contexts/openapi/panic';
import { ChapterWithSections } from '@/openapi';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const Wrapper: React.FC<{
  chapterList: ChapterWithSections[];
  children?: React.ReactNode;
}> = ({ chapterList, children }) => (
  <PanicContextProvider>
    <PanicError />
    <ChapterListContextProvider initialChapterList={chapterList}>{children}</ChapterListContextProvider>
  </PanicContextProvider>
);

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should update chapter with Chapter Delete API', async () => {
  const user = userEvent.setup();

  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(createOkResponse({}));

  const screen = render(
    <Wrapper chapterList={chapterList}>
      <ChapterList projectId="PROJECT" user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Chapter' }));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});

test('should show error message when chapter to be deleted does not exist', async () => {
  const user = userEvent.setup();

  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createNotFoundResponse({ message: 'not found', user: {}, project: {}, chapter: {} }),
  );

  const screen = render(
    <Wrapper chapterList={chapterList}>
      <ChapterList projectId="PROJECT" user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Chapter' }));

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});

test('should show error message when internal error occured', async () => {
  const user = userEvent.setup();

  const chapterList: ChapterWithSections[] = [
    {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [],
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce(createInternalErrorResponse({ message: 'internal error' }));

  const screen = render(
    <Wrapper chapterList={chapterList}>
      <ChapterList projectId="PROJECT" user={USER} />
    </Wrapper>,
  );

  await user.click(screen.getByLabelText('chapter menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Chapter'));

  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Delete Chapter' }));

  await waitFor(() => {
    expect(screen.queryByText('Fatal Error Occured')).toBeInTheDocument();
  });
  expect(screen.getByText('internal error')).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chapters/delete`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ user: { id: USER.sub }, project: { id: 'PROJECT' }, chapter: { id: 'CHAPTER' } }),
    }),
  );
});
