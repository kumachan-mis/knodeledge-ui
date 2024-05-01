import ProjectDrawerContentComponent from '@/components/organisms/top/ProjectDrawerContent/ProjectDrawerContent';

import ProjectLayout from './ProjectLayout';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProjectLayout> = {
  component: ProjectLayout,
};

export default meta;

type Story = StoryObj<typeof ProjectLayout>;

export const Basic: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
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
