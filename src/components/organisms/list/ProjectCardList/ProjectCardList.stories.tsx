import ProjectCardListComponent from './ProjectCardList';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectCardListComponent> = {
  component: ProjectCardListComponent,
};

export default meta;

type Story = StoryObj<typeof ProjectCardListComponent>;

export const Basic: Story = {
  args: {
    loadableProjectList: {
      state: 'success',
      data: [
        {
          state: 'success',
          data: {
            id: 'PROJECT_WITHOUT_DESCRIPTION',
            name: 'Project Without Description',
          },
          error: null,
        },
        {
          state: 'success',
          data: {
            id: 'PROJECT_WITH_DESCRIPTION',
            name: 'Project With Description',
            description: 'This is my project.',
          },
          error: null,
        },
        {
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
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    loadableProjectList: {
      state: 'success',
      data: [],
    },
  },
};

export const Loading: Story = {
  args: {
    loadableProjectList: {
      state: 'loading',
      data: null,
    },
  },
};
