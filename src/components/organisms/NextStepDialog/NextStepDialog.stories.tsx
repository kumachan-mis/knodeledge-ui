import { PaperContentProvider } from '@/contexts/views';

import NextStepDialogComponent from './NextStepDialog';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NextStepDialogComponent> = {
  component: NextStepDialogComponent,
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

type Story = StoryObj<typeof NextStepDialogComponent>;

export const Basic: Story = {
  decorators: [
    (Story) => (
      <PaperContentProvider
        initialContent={{
          content: ['[** Section One]', 'section one content text', 'section one content text'].join('\n'),
        }}
      >
        <Story />
      </PaperContentProvider>
    ),
  ],
};

export const MultipleSections: Story = {
  decorators: [
    (Story) => (
      <PaperContentProvider
        initialContent={{
          content: [
            '[** Section One]',
            'section one content text',
            'section one content text',
            '',
            '[** Section Two]',
            'section two content text',
            '',
            '[** Section Three]',
            'section three content text',
            '',
            '[** Section Four]',
            'section four content text',
            '',
            '[** Section Five]',
            'section five content text',
            '',
          ].join('\n'),
        }}
      >
        <Story />
      </PaperContentProvider>
    ),
  ],
};

export const NoSections: Story = {
  decorators: [
    (Story) => (
      <PaperContentProvider
        initialContent={{
          content: 'This is paper content.',
        }}
      >
        <Story />
      </PaperContentProvider>
    ),
  ],
};