import ChapterListComponent from './ChapterList';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChapterListComponent> = {
  component: ChapterListComponent,
};

export default meta;

type Story = StoryObj<typeof ChapterListComponent>;

export const Basic: Story = {
  args: {
    loadableChapterList: {
      state: 'success',
      data: [
        {
          id: 'CHAPTER_ONE',
          number: 1,
          name: 'Chapter One',
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
        {
          id: 'CHAPTER_TWO',
          number: 2,
          name: 'Chapter Two',
          sections: [
            {
              id: 'SECTION_THREE',
              name: 'Section Three',
            },
            {
              id: 'SECTION_FOUR',
              name: 'Section Four',
            },
          ],
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
