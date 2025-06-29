import ChapterFormDialogComponent from './ChapterFormDialog';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ChapterFormDialogComponent> = {
  component: ChapterFormDialogComponent,
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/require-await
    onSubmit: async () => {
      return { state: 'success', error: null };
    },
    onClose: () => {
      // Do nothing
    },
  },
  parameters: {
    docs: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof ChapterFormDialogComponent>;

export const Create: Story = {
  args: {
    title: 'New Chapter',
    submitText: 'Create Chapter',
    defaultValues: { name: '', number: '' },
  },
};

export const Update: Story = {
  args: {
    title: 'Update Chapter',
    submitText: 'Save Changes',
    defaultValues: { name: 'chapter name', number: '1' },
  },
};

export const ServerError: Story = {
  args: {
    title: 'Server Error',
    submitText: 'Submit',
    defaultValues: { name: '', number: '' },
    // eslint-disable-next-line @typescript-eslint/require-await
    onSubmit: async () => {
      return {
        state: 'error',
        error: {
          message: 'server error',
          chapter: { name: 'chapter name error', number: 'chapter number error' },
        },
      };
    },
  },
};
