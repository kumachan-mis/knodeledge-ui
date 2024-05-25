import ChapterListComponent from '@/components/organisms/ChapterList/ChapterList';
import ChapterListHeaderComponent from '@/components/organisms/ChapterListHeader/ChapterListHeader';

import ProjectLayout from './ProjectLayout';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProjectLayout> = {
  component: ProjectLayout,
};

export default meta;

type Story = StoryObj<typeof ProjectLayout>;

export const Login: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
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
        // eslint-disable-next-line @typescript-eslint/require-await
        onUpdateChapter={async () => {
          return { state: 'success', error: null };
        }}
      />
    ),
  },
};

export const Logout: Story = {
  args: {
    user: undefined,
    DrawerHeader: Login.args?.DrawerHeader,
    DrawerContent: Login.args?.DrawerContent,
  },
};

export const Loading: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
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
        // eslint-disable-next-line @typescript-eslint/require-await
        onUpdateChapter={async () => {
          return { state: 'success', error: null };
        }}
      />
    ),
  },
};

export const NotFound: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
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
        // eslint-disable-next-line @typescript-eslint/require-await
        onUpdateChapter={async () => {
          return { state: 'success', error: null };
        }}
      />
    ),
  },
};
