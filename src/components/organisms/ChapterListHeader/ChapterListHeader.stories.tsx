import ChapterListHeaderComponent from './ChapterListHeader';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChapterListHeaderComponent> = {
  component: ChapterListHeaderComponent,
};

export default meta;

type Story = StoryObj<typeof ChapterListHeaderComponent>;

export const Basic: Story = {
  args: {
    project: {
      id: 'PROJECT',
      name: 'Project',
    },
    chapterList: [
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
};
