import SectionViewComponent from './SectionView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SectionViewComponent> = {
  component: SectionViewComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateGraph: async () => {
      return { state: 'success', error: null };
    },
  },
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
            children: [
              {
                name: 'Grandchild One-One',
                relation: 'Relation One-One',
                description: 'This is grandchild one-one content.',
                children: [],
              },
              {
                name: 'Grandchild One-Two',
                relation: 'Relation One-Two',
                description: 'This is grandchild one-two content.',
                children: [],
              },
              {
                name: 'Grandchild One-Three',
                relation: 'Relation One-Three',
                description: 'This is grandchild one-three content.',
                children: [],
              },
            ],
          },
          {
            name: 'Child Two',
            relation: 'Relation Two',
            description: 'This is child two content.',
            children: [
              {
                name: 'Grandchild Two-One',
                relation: 'Relation Two-One',
                description: 'This is grandchild two-one content.',
                children: [],
              },
              {
                name: 'Grandchild Two-Two',
                relation: 'Relation Two-Two',
                description: 'This is grandchild two-two content.',
                children: [],
              },
              {
                name: 'Grandchild Two-Three',
                relation: 'Relation Two-Three',
                description: 'This is grandchild two-three content.',
                children: [],
              },
            ],
          },
          {
            name: 'Child Three',
            relation: 'Relation Three',
            description: 'This is child three content.',
            children: [
              {
                name: 'Grandchild Three-One',
                relation: 'Relation Three-One',
                description: 'This is grandchild three-one content.',
                children: [],
              },
              {
                name: 'Grandchild Three-Two',
                relation: 'Relation Three-Two',
                description: 'This is grandchild three-two content.',
                children: [],
              },
              {
                name: 'Grandchild Three-Three',
                relation: 'Relation Three-Three',
                description: 'This is grandchild three-three content.',
                children: [],
              },
            ],
          },
          {
            name: 'Child Four',
            relation: 'Relation Four',
            description: "This is child four content. It's a bit longer than the others.",
            children: [
              {
                name: 'Grandchild Four-One',
                relation: 'Relation Four-One',
                description: 'This is grandchild four-one content. It is also a bit longer than the others.',
                children: [],
              },
              {
                name: 'Grandchild Four-Two',
                relation: 'Relation Four-Two',
                description: 'This is grandchild four-two content. It is also a bit longer than the others.',
                children: [],
              },
              {
                name: 'Grandchild Four-Three',
                relation: 'Relation Four-Three',
                description: 'This is grandchild four-three content. It is also a bit longer than the others.',
                children: [],
              },
            ],
          },
          {
            name: 'Child Five',
            relation: 'Relation Five',
            description: "This is child five content. It's a bit longer than the others.",
            children: [
              {
                name: 'Grandchild Five-One',
                relation: 'Relation Five-One',
                description: 'This is grandchild five-one content. It is also a bit longer than the others.',
                children: [],
              },
              {
                name: 'Grandchild Five-Two',
                relation: 'Relation Five-Two',
                description: 'This is grandchild five-two content. It is also a bit longer than the others.',
                children: [],
              },
              {
                name: 'Grandchild Five-Three',
                relation: 'Relation Five-Three',
                description: 'This is grandchild five-three content. It is also a bit longer than the others.',
                children: [],
              },
            ],
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
