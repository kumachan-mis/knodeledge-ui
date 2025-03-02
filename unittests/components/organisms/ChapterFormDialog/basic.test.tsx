import { generateRandomString } from '../../../testutils/string';
import ChapterFormDialog from '@/components/organisms/ChapterFormDialog';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should render chapter dialog', async () => {
  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  expect(dialog.queryByText('Chapter Dialog Title')).toBeInTheDocument();
  expect(dialog.queryByRole('textbox', { name: 'Chapter Name' })).toHaveValue('');
  expect(dialog.queryByRole('textbox', { name: 'Chapter Number' })).toHaveValue('');
  expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  expect(dialog.queryByRole('button', { name: 'Close' })).toBeEnabled();

  expect(dialog.queryByText('chapter name is required')).not.toBeInTheDocument();
  expect(dialog.queryByText('chapter number is required')).not.toBeInTheDocument();
});

test('should submit chapter', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenNthCalledWith(1, { name: 'Chapter Name', number: 1 });

  expect(onClose).toHaveBeenNthCalledWith(1);
});

test('should not submit if chapter name is empty', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.cut();

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  expect(dialog.queryByText('chapter name is required')).toBeInTheDocument();
});

test('should not submit if chapter name is too long', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste(generateRandomString(100));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), 'x');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  expect(dialog.queryByText('chapter name cannot be longer than 100 characters')).toBeInTheDocument();
});

test('should not submit if chapter number is empty', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.cut();

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  expect(dialog.queryByText('chapter number is required')).toBeInTheDocument();
});

test.each<{ name: string; chapterNumber: string }>([
  {
    name: 'not a number',
    chapterNumber: 'abc',
  },
  {
    name: 'negative number',
    chapterNumber: '-1',
  },
  {
    name: 'zero',
    chapterNumber: '0',
  },
  {
    name: 'leading zero',
    chapterNumber: '01',
  },
  {
    name: 'floating point number',
    chapterNumber: '1.1',
  },
  {
    name: 'whitespace',
    chapterNumber: ' ',
  },
  {
    name: 'leading whitespace',
    chapterNumber: ' 1',
  },
  {
    name: 'trailing whitespace',
    chapterNumber: '1 ',
  },
])('should not submit if chapter number is not a positive integer ($name)', async ({ chapterNumber }) => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste(chapterNumber);

  expect(dialog.queryByText('chapter number must be a positive integer')).toBeInTheDocument();
});

test('should not submit if chapter number is too large', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.tripleClick(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('4');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  expect(dialog.queryByText('chapter number is too large')).toBeInTheDocument();
});

test('should not submit if chapter properties are same as default', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: 'Chapter Name', number: '1' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 10 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), '{backspace}');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Name' }), 'e');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Number' }), '0');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.type(dialog.getByRole('textbox', { name: 'Chapter Number' }), '{backspace}');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});

test('should show error mmessages if chapter submission fails', async () => {
  const user = userEvent.setup();

  const onSubmit = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: {
      message: 'root error',
      chapter: { name: 'name error', number: 'number error' },
    },
  });
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={onSubmit}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Name' }));
  await user.paste('Chapter Name');

  await user.click(dialog.getByRole('textbox', { name: 'Chapter Number' }));
  await user.paste('1');

  await waitFor(() => {
    expect(dialog.queryByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  await user.click(dialog.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  expect(onSubmit).toHaveBeenNthCalledWith(1, { name: 'Chapter Name', number: 1 });
  expect(onClose).not.toHaveBeenCalled();

  expect(dialog.queryByText('root error')).toBeInTheDocument();
  expect(dialog.queryByText('name error')).toBeInTheDocument();
  expect(dialog.queryByText('number error')).toBeInTheDocument();
});

test('should close dialog', async () => {
  const onClose = jest.fn();

  const screen = render(
    <ChapterFormDialog
      defaultValues={{ name: '', number: '' }}
      onClose={onClose}
      onSubmit={jest.fn()}
      open
      submitText="Submit"
      title="Chapter Dialog Title"
      validates={{ number: (value) => parseInt(value, 10) <= 3 || 'chapter number is too large' }}
    />,
  );
  const dialog = within(await screen.findByRole('dialog'));

  await userEvent.click(dialog.getByRole('button', { name: 'Close' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});
