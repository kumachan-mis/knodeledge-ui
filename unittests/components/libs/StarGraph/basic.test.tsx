import StarGraph from '@/components/libs/StarGraph';
import GraphChildWithId from '@/components/libs/StarGraph/GraphChildWithId';
import GraphRootWithId from '@/components/libs/StarGraph/GraphRootWithId';
import { StarGraphContent, useStarGraph } from '@/components/libs/StarGraph/hooks';

import { render, RenderResult, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalSvgGetClientRect = SVGSVGElement.prototype.getBoundingClientRect;
beforeAll(() => {
  Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 }),
  });
  Object.defineProperty(SVGSVGElement.prototype, 'getBoundingClientRect', {
    writable: true,
    value: jest.fn().mockReturnValue({ x: 0, y: 0, width: 1000, height: 800 }),
  });
});

afterAll(() => {
  Object.defineProperty(SVGSVGElement.prototype, 'getBoundingClientRect', {
    writable: true,
    value: originalSvgGetClientRect,
  });
  Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: undefined,
  });
});

test.each<{
  name: string;
  graphRoot: GraphRootWithId;
  graphRootChildren: GraphChildWithId[];
  assertElements: (screen: RenderResult) => Promise<void>;
}>([
  {
    name: 'without children',
    graphRoot: {
      id: 'GRAPH',
      name: 'Graph',
    },
    graphRootChildren: [],
    assertElements: async (screen) => {
      await waitFor(() => {
        expect(screen.queryByText('Graph')).toBeVisible();
      });

      expect(screen.container.querySelectorAll('[data-star-graph="parent-node"]')).toHaveLength(1);
      expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(0);
      expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(0);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);
    },
  },
  {
    name: 'with children',
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
        children: [],
      },
      {
        id: 'CHILD_TWO',
        name: 'Child Two',
        relation: 'Relation Two',
        description: 'This is child two content.',
        children: [],
      },
      {
        id: 'CHILD_THREE',
        name: 'Child Three',
        relation: 'Relation Three',
        description: 'This is child three content.',
        children: [],
      },
      {
        id: 'CHILD_FOUR',
        name: 'Child Four',
        relation: 'Relation Four',
        description: 'This is child four content.',
        children: [],
      },
      {
        id: 'CHILD_FIVE',
        name: 'Child Five',
        relation: 'Relation Five',
        description: 'This is child five content.',
        children: [],
      },
    ],
    assertElements: async (screen) => {
      await waitFor(() => {
        expect(screen.queryByText('Graph')).toBeVisible();
      });

      expect(screen.queryByText('Child One')).toBeVisible();
      expect(screen.queryByText('Child Two')).toBeVisible();
      expect(screen.queryByText('Child Three')).toBeVisible();
      expect(screen.queryByText('Child Four')).toBeVisible();
      expect(screen.queryByText('Child Five')).toBeVisible();

      expect(screen.queryByText('Relation One')).toBeVisible();
      expect(screen.queryByText('Relation Two')).toBeVisible();
      expect(screen.queryByText('Relation Three')).toBeVisible();
      expect(screen.queryByText('Relation Four')).toBeVisible();
      expect(screen.queryByText('Relation Five')).toBeVisible();

      expect(screen.queryByText('This is child one content.')).not.toBeVisible();
      expect(screen.queryByText('This is child two content.')).not.toBeVisible();
      expect(screen.queryByText('This is child three content.')).not.toBeVisible();
      expect(screen.queryByText('This is child four content.')).not.toBeVisible();
      expect(screen.queryByText('This is child five content.')).not.toBeVisible();

      expect(screen.container.querySelectorAll('[data-star-graph="parent-node"]')).toHaveLength(1);
      expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(5);
      expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(5);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);
    },
  },
  {
    name: 'with grandchildren',
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
    ],
    assertElements: async (screen) => {
      await waitFor(() => {
        expect(screen.queryByText('Graph')).toBeVisible();
      });

      expect(screen.queryByText('Child One')).toBeVisible();
      expect(screen.queryByText('Child Two')).toBeVisible();
      expect(screen.queryByText('Child Three')).toBeVisible();

      expect(screen.queryByText('Relation One')).toBeVisible();
      expect(screen.queryByText('Relation Two')).toBeVisible();
      expect(screen.queryByText('Relation Three')).toBeVisible();

      expect(screen.queryByText('This is child one content.')).not.toBeVisible();
      expect(screen.queryByText('This is child two content.')).not.toBeVisible();
      expect(screen.queryByText('This is child three content.')).not.toBeVisible();

      expect(screen.queryByText('Grandchild One-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild One-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild One-Three')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Two-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Two-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Two-Three')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Three-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Three-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild Three-Three')).not.toBeInTheDocument();

      expect(screen.queryByText('Relation One-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation One-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation One-Three')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Two-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Two-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Two-Three')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Three-One')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Three-Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Relation Three-Three')).not.toBeInTheDocument();

      expect(screen.queryByText('This is grandchild one-one content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild one-two content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild one-three content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild two-one content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild two-two content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild two-three content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild three-one content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild three-two content.')).not.toBeInTheDocument();
      expect(screen.queryByText('This is grandchild three-three content.')).not.toBeInTheDocument();

      expect(screen.container.querySelectorAll('[data-star-graph="parent-node"]')).toHaveLength(1);
      expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(3);
      expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(3);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
      expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);
    },
  },
])('should show a star graph ($name)', async ({ graphRoot, graphRootChildren, assertElements }) => {
  const screen = render(<StarGraphWithHooks graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);
  await assertElements(screen);
});

test('should focus and blur link', async () => {
  const user = userEvent.setup();
  const screen = render(
    <StarGraphWithHooks
      graphRoot={{
        id: 'GRAPH',
        name: 'Graph',
      }}
      graphRootChildren={[
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
          children: [],
        },
        {
          id: 'CHILD_THREE',
          name: 'Child Three',
          relation: 'Relation Three',
          description: 'This is child three content.',
          children: [],
        },
      ]}
    />,
  );

  await waitFor(() => {
    expect(screen.queryByText('Graph')).toBeVisible();
  });

  expect(screen.container.querySelector('[aria-selected="true"]')).not.toBeInTheDocument();

  await user.click(screen.getByText('Relation One'));

  await waitFor(() => {
    expect(screen.getByText('Relation One').closest('g')).toHaveAttribute('aria-selected', 'true');
  });

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Child One') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Expand' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  expect(screen.container.querySelector('[aria-selected="true"]')).not.toBeInTheDocument();

  await user.click(screen.getByText('Relation One-Two'));

  await waitFor(() => {
    expect(screen.getByText('Relation One-Two').closest('g')).toHaveAttribute('aria-selected', 'true');
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(screen.container.querySelector('svg')!);

  await waitFor(() => {
    expect(screen.container.querySelector('[aria-selected="true"]')).not.toBeInTheDocument();
  });
});
