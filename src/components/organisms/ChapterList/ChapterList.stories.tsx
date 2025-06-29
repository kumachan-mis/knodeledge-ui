import SectionListComponent from '@/components/organisms/SectionList/SectionList';

import ChapterListComponent from './ChapterList';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ChapterListComponent> = {
  component: ChapterListComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateChapter: async () => {
      return { state: 'success', error: null };
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    onDeleteChapter: async () => {
      return { state: 'success', error: null };
    },
    SectionList: (props) => (
      <SectionListComponent
        // eslint-disable-next-line @typescript-eslint/require-await
        onDeleteSection={async () => {
          return { state: 'success', error: null };
        }}
        {...props}
      />
    ),
  },
};

export default meta;

type Story = StoryObj<typeof ChapterListComponent>;

export const Basic: Story = {
  args: {
    chapterList: [
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
};
