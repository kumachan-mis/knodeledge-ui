import { StarGraphChild, StarGraphContentProvider, StarGraphRoot } from './context';
import { useStarGraph } from './hooks';

import StarGraph from './index';

import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const StarGraphWithContexts: React.FC<{
  readonly graphRoot: StarGraphRoot;
  readonly graphRootChildren: StarGraphChild[];
}> = ({ graphRoot, graphRootChildren }) => (
  <StarGraphContentProvider graphRoot={graphRoot} graphRootChildren={graphRootChildren}>
    <StarGraphWithHooks />
  </StarGraphContentProvider>
);

const StarGraphWithHooks: React.FC = () => {
  const props = useStarGraph();
  return <StarGraph {...props} />;
};

const meta: Meta = {
  component: StarGraphWithContexts,
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '480px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StarGraphWithHooks>;

export const Basic: Story = {
  args: {
    graphRoot: {
      name: 'Graph',
    },
    graphRootChildren: [
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
};
