import ChapterListComponent from '@/components/organisms/ChapterList/ChapterList';
import ChapterListHeaderComponent from '@/components/organisms/ChapterListHeader/ChapterListHeader';
import SectionListComponent from '@/components/organisms/SectionList/SectionList';

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
        chapterList={[
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
        ]}
        // eslint-disable-next-line @typescript-eslint/require-await
        onCreateChapter={async () => ({ state: 'success', data: [], error: null })}
        project={{
          id: 'PROJECT',
          name: 'Project Without Description',
        }}
      />
    ),
    DrawerContent: () => (
      <ChapterListComponent
        SectionList={(props) => (
          <SectionListComponent
            // eslint-disable-next-line @typescript-eslint/require-await
            onDeleteSection={async () => ({ state: 'success', data: [], error: null })}
            {...props}
          />
        )}
        chapterList={[
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
        ]}
        // eslint-disable-next-line @typescript-eslint/require-await
        onDeleteChapter={async () => ({ state: 'success', data: [], error: null })}
        // eslint-disable-next-line @typescript-eslint/require-await
        onUpdateChapter={async () => ({ state: 'success', data: [], error: null })}
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
