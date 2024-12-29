import NextStepDialog from '@/components/organisms/NextStepDialog';
import { PaperContentProvider } from '@/contexts/views';

import { waitFor, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should render next step dialog', async () => {
  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(<NextStepDialog onClose={onClose} onSubmit={onSubmit} open />, {
    wrapper: ({ children }) => (
      <PaperContentProvider
        loadablePaper={{
          data: {
            id: 'PAPER',
            content: [
              '[** Section 1]',
              'section one text section one text',
              '[** Section 2]',
              'section two text section two text',
              'section two text section two text',
            ].join('\n'),
          },
          state: 'success',
        }}
      >
        {children}
      </PaperContentProvider>
    ),
  });
  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.queryByText('Section 1')).toBeInTheDocument();
  expect(dialog.queryByText('Section 2')).not.toBeInTheDocument();

  expect(dialog.queryByRole('button', { name: 'Go to Next Step' })).toBeEnabled();
  expect(dialog.queryByRole('button', { name: 'Close' })).toBeEnabled();

  expect(dialog.getByLabelText('Go to previous page')).toBeDisabled();
  expect(dialog.getByLabelText('page 1')).toBeEnabled();
  expect(dialog.getByLabelText('Go to page 2')).toBeEnabled();
  expect(dialog.getByLabelText('Go to next page')).toBeEnabled();
});

test('should sectionalize paper', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(<NextStepDialog onClose={onClose} onSubmit={onSubmit} open />, {
    wrapper: ({ children }) => (
      <PaperContentProvider
        loadablePaper={{
          data: {
            id: 'PAPER',
            content: [
              '[** Section 1]',
              'section one text section one text',
              '[** Section 2]',
              'section two text section two text',
              'section two text section two text',
            ].join('\n'),
          },
          state: 'success',
        }}
      >
        {children}
      </PaperContentProvider>
    ),
  });
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenNthCalledWith(1, [
    {
      name: 'Section 1',
      content: 'section one text section one text',
    },
    {
      name: 'Section 2',
      content: 'section two text section two text\nsection two text section two text',
    },
  ]);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('should close dialog', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn();
  const onClose = jest.fn();

  const screen = render(<NextStepDialog onClose={onClose} onSubmit={onSubmit} open />, {
    wrapper: ({ children }) => (
      <PaperContentProvider
        loadablePaper={{
          data: {
            id: 'PAPER',
            content: [
              '[** Section 1]',
              'section one text section one text',
              '[** Section 2]',
              'section two text section two text',
              'section two text section two text',
            ].join('\n'),
          },
          state: 'success',
        }}
      >
        {children}
      </PaperContentProvider>
    ),
  });
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Close' }));

  expect(onSubmit).toHaveBeenCalledTimes(0);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test.each<{
  name: string;
  content: string;
  errorMessage: string;
}>([
  {
    name: 'empty content',
    content: '',
    errorMessage: 'content should start with a section heading',
  },
  {
    name: 'no section',
    content: 'section one text section one text',
    errorMessage: 'content should start with a section heading',
  },
  {
    name: 'chapter section',
    content: [
      '[** Section 1]',
      'section one text section one text',
      '[*** Section 2]',
      'section two text section two text',
      'section two text section two text',
    ].join('\n'),
    errorMessage: 'content should not have chapter headings',
  },
  {
    name: 'no section name',
    content: [
      '[** ]',
      'section one text section one text',
      '[** Section 2]',
      'section two text section two text',
      'section two text section two text',
    ].join('\n'),
    errorMessage: 'section name should not be empty',
  },
  {
    name: 'duplicate section name',
    content: [
      '[** Section 1]',
      'section one text section one text',
      '[** Section 2]',
      'section two text section two text',
      '[** Section 1]',
      'section two text section two text',
      'section two text section two text',
    ].join('\n'),
    errorMessage: 'section name should not be duplicated',
  },
])('should not submit if paper is not acceptable to being sectionalized ($name)', async ({ content, errorMessage }) => {
  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(<NextStepDialog onClose={onClose} onSubmit={onSubmit} open />, {
    wrapper: ({ children }) => (
      <PaperContentProvider
        loadablePaper={{
          data: { id: 'PAPER', content },
          state: 'success',
        }}
      >
        {children}
      </PaperContentProvider>
    ),
  });

  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.getByText(errorMessage)).toBeInTheDocument();

  expect(dialog.getByRole('button', { name: 'Go to Next Step' })).toBeDisabled();
  expect(dialog.getByRole('button', { name: 'Close' })).toBeEnabled();
});

test.each<{
  name: string;
  error: object;
  errorMessage: string;
}>([
  {
    name: 'full error',
    error: {
      message: 'error',
      sections: { message: 'sections error', items: [{}, {}] },
    },
    errorMessage: 'error: sections error',
  },
  {
    name: 'error without sections error',
    error: {
      message: 'error',
      sections: { message: '', items: [] },
    },
    errorMessage: 'error',
  },
  {
    name: 'error without message',
    error: {
      message: '',
      sections: { message: 'sections error', items: [{}, {}] },
    },
    errorMessage: 'sections error',
  },
])('should show error when failed to sectionalize paper (#name)', async ({ error, errorMessage }) => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'error', error });
  const onClose = jest.fn();

  const screen = render(<NextStepDialog onClose={onClose} onSubmit={onSubmit} open />, {
    wrapper: ({ children }) => (
      <PaperContentProvider
        loadablePaper={{
          data: {
            id: 'PAPER',
            content: [
              '[** Section 1]',
              'section one text section one text',
              '[** Section 2]',
              'section two text section two text',
              'section two text section two text',
            ].join('\n'),
          },
          state: 'success',
        }}
      >
        {children}
      </PaperContentProvider>
    ),
  });
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('button', { name: 'Go to Next Step' }));

  await waitFor(() => {
    expect(dialog.getByText(errorMessage)).toBeInTheDocument();
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenNthCalledWith(1, [
    {
      name: 'Section 1',
      content: 'section one text section one text',
    },
    {
      name: 'Section 2',
      content: 'section two text section two text\nsection two text section two text',
    },
  ]);

  expect(onClose).toHaveBeenCalledTimes(0);
});
