import { GraphContentProvider } from '@/contexts/views';

import SectionViewComponent from './SectionView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SectionViewComponent> = {
  component: SectionViewComponent,
};

export default meta;

type Story = StoryObj<typeof SectionViewComponent>;

export const Basic: Story = {
  args: {
    project: {
      id: 'PROJECT',
      name: 'Project Name',
    },
    chapter: {
      id: 'CHAPTER',
      name: 'Section Name',
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
    section: {
      id: 'SECTION_ONE',
      name: 'Section One',
    },
    loadableGraph: {
      state: 'success',
      data: {
        id: 'GRAPH',
        name: 'Section One',
        paragraph: 'This is graph content.',
      },
    },
  },
  decorators: [
    (Story) => (
      <GraphContentProvider initialContent={{ paragraph: 'This is graph content.' }}>
        <Story />
      </GraphContentProvider>
    ),
  ],
};

export const Loading: Story = {
  args: {
    ...Basic.args,
    loadableGraph: {
      state: 'loading',
      data: null,
    },
  },
};
