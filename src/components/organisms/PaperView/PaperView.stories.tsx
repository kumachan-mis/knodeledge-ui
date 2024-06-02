import PaperViewComponent from './PaperView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PaperViewComponent> = {
  component: PaperViewComponent,
};

export default meta;

type Story = StoryObj<typeof PaperViewComponent>;

export const Basic: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT',
        name: 'Project Name',
      },
    },
    loadableChapter: {
      state: 'success',
      data: {
        id: 'CHAPTER',
        name: 'Chapter Name',
        number: 1,
      },
    },
    loadablePaper: {
      state: 'success',
      data: {
        id: 'PAPER',
        content: 'This is paper content.',
      },
    },
  },
};
export const Loading: Story = {
  args: {
    loadableProject: {
      state: 'loading',
      data: null,
    },
    loadableChapter: {
      state: 'loading',
      data: null,
    },
    loadablePaper: {
      state: 'loading',
      data: null,
    },
  },
};
