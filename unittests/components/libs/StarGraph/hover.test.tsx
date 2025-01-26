import StarGraph from '@/components/libs/StarGraph';
import GraphChildWithId from '@/components/libs/StarGraph/GraphChildWithId';
import GraphRootWithId from '@/components/libs/StarGraph/GraphRootWithId';
import { StarGraphContent, useStarGraph } from '@/components/libs/StarGraph/hooks';

import { render, waitFor, within } from '@testing-library/react';
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

const graphRoot: GraphRootWithId = {
  id: 'GRAPH',
  name: 'Graph',
};
const graphRootChildren: GraphChildWithId[] = [
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
];

test('should show description on hover link between root node and child node when root node expanded', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithHooks graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
  });

  expect(screen.queryByText('This is child one content.')).not.toBeVisible();

  await user.hover(screen.getByText('Relation One'));

  await waitFor(() => {
    expect(screen.getByText('This is child one content.')).toBeVisible();
  });
});

test('should show description on hover link between child node and grandchild node when child node expanded', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithHooks graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
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

  expect(screen.queryByText('This is grandchild one-one content.')).not.toBeVisible();

  await user.hover(screen.getByText('Relation One-One'));

  await waitFor(() => {
    expect(screen.getByText('This is grandchild one-one content.')).toBeVisible();
  });
});

test('should nothing happened on hover link between root node and child node when child node expanded', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithHooks graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
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

  expect(screen.queryByText('This is child one content.')).not.toBeVisible();

  await user.hover(screen.getByText('Relation One'));

  await new Promise((resolve) => setTimeout(resolve, 500));

  expect(screen.queryByText('This is child one content.')).not.toBeVisible();
});
