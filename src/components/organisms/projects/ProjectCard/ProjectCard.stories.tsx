import ProjectCardComponent from './ProjectCard';

import Box from '@mui/material/Box';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectCardComponent> = {
  component: ProjectCardComponent,
  decorators: [
    (Story) => (
      <Box width="250px">
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProjectCardComponent>;

export const WithoutDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT_WITHOUT_DESCRIPTION',
        name: 'Project Without Description',
      },
      error: null,
    },
  },
};

export const WithDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT_WITH_DESCRIPTION',
        name: 'Project With Description',
        description: 'This is my project.',
      },
      error: null,
    },
  },
};

export const LongDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT_WITH_LONG_DESCRIPTION',
        name: 'Project With Long Description',
        description: [
          "My project's description is very long.",
          "It's so long that it's hard to fit it in a single line.",
          "This long description is a good test for the component's layout.",
          "This long description is a good test for the component's layout.",
        ].join(' '),
      },
      error: null,
    },
  },
};

export const Loading: Story = {
  args: {
    loadableProject: {
      state: 'loading',
      data: {
        id: 'PROJECT_LOADING',
        name: 'Project Loading',
      },
      error: null,
    },
  },
};
