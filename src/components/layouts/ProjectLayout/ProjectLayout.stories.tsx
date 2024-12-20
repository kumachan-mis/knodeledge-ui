import ChapterListComponent from '@/components/organisms/ChapterList/ChapterList';
import ChapterListHeaderComponent from '@/components/organisms/ChapterListHeader/ChapterListHeader';

import ProjectLayout from './ProjectLayout';

import { Meta, StoryObj } from '@storybook/react';

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
        }}
        // eslint-disable-next-line @typescript-eslint/require-await
        onUpdateChapter={async () => {
          return { state: 'success', error: null };
        }}
        projectId="PROJECT"
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
        projectId="PROJECT"
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
        projectId="PROJECT"
      />
    ),
  },
};
