import ProjectDrawerContentComponent from './ProjectDrawerContent';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectDrawerContentComponent> = {
  component: ProjectDrawerContentComponent,
};

export default meta;

type Story = StoryObj<typeof ProjectDrawerContentComponent>;

export const Basic: Story = {
  args: {
    loadableChapterList: {
      state: 'success',
      data: [
        {
          id: 'CHAPTER_ONE',
          number: 1,
          name: 'Chapter One',
        },
        {
          id: 'CHAPTER_TWO',
          number: 2,
          name: 'Chapter Two',
        },
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    loadableChapterList: {
      state: 'loading',
      data: null,
    },
  },
};

export const NotFound: Story = {
  args: {
    loadableChapterList: {
      state: 'notfound',
      data: null,
    },
  },
};
