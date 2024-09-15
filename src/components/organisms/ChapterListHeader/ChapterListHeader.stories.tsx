import ChapterListHeaderComponent from './ChapterListHeader';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChapterListHeaderComponent> = {
  component: ChapterListHeaderComponent,
};

export default meta;

type Story = StoryObj<typeof ChapterListHeaderComponent>;

export const Basic: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT',
        name: 'Project',
      },
    },
    loadableChapterList: {
      state: 'success',
      data: [
        {
          id: 'CHAPTER_ONE',
          name: 'Chapter One',
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
        {
          id: 'CHAPTER_TWO',
          name: 'Chapter Two',
          number: 2,
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
    loadableProject: {
      state: 'loading',
      data: null,
    },
    loadableChapterList: {
      state: 'loading',
      data: null,
    },
  },
};

export const NotFound: Story = {
  args: {
    loadableProject: {
      state: 'notfound',
      data: null,
    },
    loadableChapterList: {
      state: 'notfound',
      data: null,
    },
  },
};
