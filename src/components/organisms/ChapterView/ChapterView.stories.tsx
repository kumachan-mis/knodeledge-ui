import { PaperContentProvider } from '@/contexts/views';

import ChapterViewComponent from './ChapterView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChapterViewComponent> = {
  component: ChapterViewComponent,
};

export default meta;

type Story = StoryObj<typeof ChapterViewComponent>;

export const Basic: Story = {
  args: {
    project: {
      id: 'PROJECT',
      name: 'Project Name',
    },
    chapter: {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
      sections: [
        {
          id: 'SECTION_ONE',
          name: 'Section One',
        },
        {
          id: 'SECTION_TWO',
          name: 'Section Two',
        },
      ],
    },
    loadablePaper: {
      state: 'success',
      data: {
        id: 'PAPER',
        content: 'This is paper content.',
      },
    },
  },
  decorators: [
    (Story) => (
      <PaperContentProvider
        loadablePaper={{
          data: { id: 'PAPER', content: 'This is paper content.' },
          state: 'success',
        }}
      >
        <Story />
      </PaperContentProvider>
    ),
  ],
};

export const Loading: Story = {
  args: {
    ...Basic.args,
    loadablePaper: {
      state: 'loading',
      data: null,
    },
  },
};
