import GraphChildWithId from './GraphChildWithId';
import GraphRootWithId from './GraphRootWithId';
import { StarGraphContent, useStarGraph } from './hooks';

import StarGraph from './index';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const StarGraphWithHooks: React.FC<{
  readonly graphRoot: GraphRootWithId;
  readonly graphRootChildren: GraphChildWithId[];
}> = ({ graphRoot, graphRootChildren }) => {
  const [graphContent, setGraphContent] = React.useState<StarGraphContent>({
    graphRootChildren: graphRootChildren,
    focusedGraphParentId: graphRoot.id,
    focusedGraphChildId: '',
  });
  const props = useStarGraph({ graphRoot, graphContent, setGraphContent });

  return <StarGraph {...props} />;
};

const meta: Meta = {
  component: StarGraphWithHooks,
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
      id: 'GRAPH',
      name: 'Graph',
    },
    graphRootChildren: [
      {
        id: 'CHILD_ONE',
        name: 'Child One',
        relation: 'Relation One',
        description: 'This is child one content.',
        children: [
          {
            id: 'GRANDCHILD_ONE_ONE',
            name: 'Grandchild One-One',
            relation: 'Relation One-One',
            description: 'This is grandchild one-one content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_ONE_TWO',
            name: 'Grandchild One-Two',
            relation: 'Relation One-Two',
            description: 'This is grandchild one-two content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_ONE_THREE',
            name: 'Grandchild One-Three',
            relation: 'Relation One-Three',
            description: 'This is grandchild one-three content.',
            children: [],
          },
        ],
      },
      {
        id: 'CHILD_TWO',
        name: 'Child Two',
        relation: 'Relation Two',
        description: 'This is child two content.',
        children: [
          {
            id: 'GRANDCHILD_TWO_ONE',
            name: 'Grandchild Two-One',
            relation: 'Relation Two-One',
            description: 'This is grandchild two-one content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_TWO_TWO',
            name: 'Grandchild Two-Two',
            relation: 'Relation Two-Two',
            description: 'This is grandchild two-two content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_TWO_THREE',
            name: 'Grandchild Two-Three',
            relation: 'Relation Two-Three',
            description: 'This is grandchild two-three content.',
            children: [],
          },
        ],
      },
      {
        id: 'CHILD_THREE',
        name: 'Child Three',
        relation: 'Relation Three',
        description: 'This is child three content.',
        children: [
          {
            id: 'GRANDCHILD_THREE_ONE',
            name: 'Grandchild Three-One',
            relation: 'Relation Three-One',
            description: 'This is grandchild three-one content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_THREE_TWO',
            name: 'Grandchild Three-Two',
            relation: 'Relation Three-Two',
            description: 'This is grandchild three-two content.',
            children: [],
          },
          {
            id: 'GRANDCHILD_THREE_THREE',
            name: 'Grandchild Three-Three',
            relation: 'Relation Three-Three',
            description: 'This is grandchild three-three content.',
            children: [],
          },
        ],
      },
      {
        id: 'CHILD_FOUR',
        name: 'Child Four',
        relation: 'Relation Four',
        description: "This is child four content. It's a bit longer than the others.",
        children: [
          {
            id: 'GRANDCHILD_FOUR_ONE',
            name: 'Grandchild Four-One',
            relation: 'Relation Four-One',
            description: 'This is grandchild four-one content. It is also a bit longer than the others.',
            children: [],
          },
          {
            id: 'GRANDCHILD_FOUR_TWO',
            name: 'Grandchild Four-Two',
            relation: 'Relation Four-Two',
            description: 'This is grandchild four-two content. It is also a bit longer than the others.',
            children: [],
          },
          {
            id: 'GRANDCHILD_FOUR_THREE',
            name: 'Grandchild Four-Three',
            relation: 'Relation Four-Three',
            description: 'This is grandchild four-three content. It is also a bit longer than the others.',
            children: [],
          },
        ],
      },
      {
        id: 'CHILD_FIVE',
        name: 'Child Five',
        relation: 'Relation Five',
        description: "This is child five content. It's a bit longer than the others.",
        children: [
          {
            id: 'GRANDCHILD_FIVE_ONE',
            name: 'Grandchild Five-One',
            relation: 'Relation Five-One',
            description: 'This is grandchild five-one content. It is also a bit longer than the others.',
            children: [],
          },
          {
            id: 'GRANDCHILD_FIVE_TWO',
            name: 'Grandchild Five-Two',
            relation: 'Relation Five-Two',
            description: 'This is grandchild five-two content. It is also a bit longer than the others.',
            children: [],
          },
          {
            id: 'GRANDCHILD_FIVE_THREE',
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
