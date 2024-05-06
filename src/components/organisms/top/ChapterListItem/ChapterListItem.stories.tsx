import ChapterListItemComponent from './ChapterListItem';

import List from '@mui/material/List';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ChapterListItemComponent> = {
  component: ChapterListItemComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateChapter: async () => {
      return { state: 'success', error: null };
    },
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
    },
    maxChapterNumber: 1,
  },
};
