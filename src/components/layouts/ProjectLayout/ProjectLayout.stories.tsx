import ProjectDrawerContentComponent from '@/components/organisms/top/ProjectDrawerContent/ProjectDrawerContent';
import ProjectDrawerHeaderComponent from '@/components/organisms/top/ProjectDrawerHeader/ProjectDrawerHeader';

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
      <ProjectDrawerHeaderComponent
        loadableProject={{
          state: 'success',
          data: {
            id: 'PROJECT',
            name: 'Project Without Description',
          },
        }}
      />
    ),
    DrawerContent: () => (
      <ProjectDrawerContentComponent
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
      <ProjectDrawerHeaderComponent
        loadableProject={{
          state: 'loading',
          data: null,
        }}
      />
    ),
    DrawerContent: () => (
      <ProjectDrawerContentComponent
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
      <ProjectDrawerHeaderComponent
        loadableProject={{
          state: 'notfound',
          data: null,
        }}
      />
    ),
    DrawerContent: () => (
      <ProjectDrawerContentComponent
        loadableChapterList={{
          state: 'notfound',
          data: null,
        }}
      />
    ),
  },
};
