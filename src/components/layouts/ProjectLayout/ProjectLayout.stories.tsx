import ChapterListComponent from '@/components/organisms/top/ChapterList/ChapterList';
import ChapterListHeaderComponent from '@/components/organisms/top/ChapterListHeader/ChapterListHeader';

import ProjectLayout from './ProjectLayout';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProjectLayout> = {
  component: ProjectLayout,
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectLayout>;

export const Basic: Story = {
  args: {
    DrawerHeader: () => (
      <ChapterListHeaderComponent
        loadableChapterList={{
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
        }}
        loadableProject={{
          state: 'success',
          data: {
            id: 'PROJECT',
            name: 'Project Without Description',
          },
        }}
        // eslint-disable-next-line @typescript-eslint/require-await
        onCreateChapter={async () => ({ state: 'success', data: [], error: null })}
      />
    ),
    DrawerContent: () => (
      <ChapterListComponent
        loadableChapterList={{
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
        }}
      />
    ),
  },
};

export const Loading: Story = {
  args: {
    DrawerHeader: () => (
      <ChapterListHeaderComponent
        loadableChapterList={{
          state: 'loading',
          data: null,
        }}
        loadableProject={{
          state: 'loading',
          data: null,
        }}
        // eslint-disable-next-line @typescript-eslint/require-await
        onCreateChapter={async () => ({ state: 'success', data: [], error: null })}
      />
    ),
    DrawerContent: () => (
      <ChapterListComponent
        loadableChapterList={{
          state: 'loading',
          data: null,
        }}
      />
    ),
  },
};

export const NotFound: Story = {
  args: {
    DrawerHeader: () => (
      <ChapterListHeaderComponent
        loadableChapterList={{
          state: 'notfound',
          data: null,
        }}
        loadableProject={{
          state: 'notfound',
          data: null,
        }}
        // eslint-disable-next-line @typescript-eslint/require-await
        onCreateChapter={async () => ({ state: 'success', data: [], error: null })}
      />
    ),
    DrawerContent: () => (
      <ChapterListComponent
        loadableChapterList={{
          state: 'notfound',
          data: null,
        }}
      />
    ),
  },
};
