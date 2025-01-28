import StarGraph from '@/components/libs/StarGraph';
import { StarGraphChild, StarGraphContentProvider, StarGraphRoot } from '@/components/libs/StarGraph/context';
import { useStarGraph } from '@/components/libs/StarGraph/hooks';

import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const graphRoot: StarGraphRoot = {
  name: 'Graph',
};
const graphRootChildren: StarGraphChild[] = [
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
];

test('should show description on hover link between root node and child node when root node expanded', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

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
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

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
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

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
