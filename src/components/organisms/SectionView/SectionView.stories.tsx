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
        children: [
          {
            name: 'Child One',
            relation: 'Relation One',
            description: 'This is child one content.',
            children: [],
          },
          {
            name: 'Child Two',
            relation: 'Relation Two',
            description: 'This is child two content.',
            children: [],
          },
          {
            name: 'Child Three',
            relation: 'Relation Three',
            description: 'This is child three content.',
            children: [],
          },
          {
            name: 'Child Four',
            relation: 'Relation Four',
            description: "This is child four content. It's a bit longer than the others.",
            children: [],
          },
          {
            name: 'Child Five',
            relation: 'Relation Five',
            description: "This is child five content. It's a bit longer than the others.",
            children: [],
          },
        ],
      },
    },
  },
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

export const NotFound: Story = {
  args: {
    ...Basic.args,
    loadableGraph: {
      state: 'notfound',
      data: null,
    },
  },
};
