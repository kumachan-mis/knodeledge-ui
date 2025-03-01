import SectionListComponent from '@/components/organisms/SectionList/SectionList';

import ChapterListItemComponent from './ChapterListItem';

import List from '@mui/material/List';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChapterListItemComponent> = {
  component: ChapterListItemComponent,
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
  decorators: [
    (Story) => (
      <List>
        <Story />
      </List>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ChapterListItemComponent>;

export const Basic: Story = {
  args: {
    chapter: {
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
    maxChapterNumber: 1,
  },
};
