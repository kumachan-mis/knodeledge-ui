import StarGraph from '@/components/libs/StarGraph';
import { StarGraphContentProvider, StarGraphRoot, StarGraphChild } from '@/components/libs/StarGraph/context';
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

test('should delete a child node', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
  });
  screen.queryAllByText(/^Child [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  screen.queryAllByText(/^Relation [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Child One') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Delete' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  expect(baseElement.queryByText('Child One')).not.toBeInTheDocument();
  expect(baseElement.queryByText('Relation One')).not.toBeInTheDocument();
  expect(baseElement.queryByText('This is child one content.')).not.toBeInTheDocument();

  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(2);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(2);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);
});

test('should delete a grandchild node', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
  });
  screen.queryAllByText(/^Child [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  screen.queryAllByText(/^Relation [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Child One') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Expand' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parentNode = within(screen.container.querySelector('[data-star-graph="parent-node"]')!);
  expect(parentNode.getByText('Child One')).toBeVisible();

  screen.queryAllByText(/^Grandchild One-[A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });

  screen.queryAllByText(/^Relation One-[A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Grandchild One-One') });

  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Delete' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  expect(baseElement.queryByText('Grandchild One-One')).not.toBeInTheDocument();
  expect(baseElement.queryByText('Relation One-One')).not.toBeInTheDocument();
  expect(baseElement.queryByText('This is grandchild one-one content.')).not.toBeInTheDocument();

  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(2);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(2);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(3);
});

test('should delete button of root node disabled when root node expanded', async () => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
  });
  screen.queryAllByText(/^Child [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  screen.queryAllByText(/^Relation [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });

  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Graph') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  expect(baseElement.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');

  await user.click(baseElement.getByRole('menuitem', { name: 'Delete' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });
  expect(baseElement.getByText('Graph')).toBeVisible();
});

test.each<{
  name: string;
  graphNodeName: string;
}>([
  {
    name: 'root node',
    graphNodeName: 'Graph',
  },
  {
    name: 'expanded child node',
    graphNodeName: 'Child One',
  },
  {
    name: 'colloposed child node',
    graphNodeName: 'Child Two',
  },
])('should delete button of node disabled when child node expanded ($name)', async ({ graphNodeName }) => {
  const user = userEvent.setup();
  const screen = render(<StarGraphWithContexts graphRoot={graphRoot} graphRootChildren={graphRootChildren} />);

  await waitFor(() => {
    expect(screen.getByText('Graph')).toBeVisible();
  });
  screen.queryAllByText(/^Child [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });
  screen.queryAllByText(/^Relation [A-Za-z]+$/).forEach((element) => {
    expect(element).toBeVisible();
  });

  expect(screen.container.querySelector('[data-star-graph="parent-node"]')).toBeInTheDocument();
  expect(screen.container.querySelectorAll('[data-star-graph="child-node"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="link"]')).toHaveLength(3);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-node"]')).toHaveLength(0);
  expect(screen.container.querySelectorAll('[data-star-graph="inactive-link"]')).toHaveLength(0);

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText('Child One') });

  const baseElement = within(screen.baseElement);
  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Expand' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });

  await user.pointer({ keys: '[MouseRight>]', target: screen.getByText(graphNodeName) });

  await waitFor(() => {
    expect(baseElement.getByRole('presentation')).toBeInTheDocument();
  });

  await user.click(baseElement.getByRole('menuitem', { name: 'Delete' }));

  await waitFor(() => {
    expect(baseElement.queryByRole('presentation')).not.toBeInTheDocument();
  });
  expect(baseElement.getByText(graphNodeName)).toBeVisible();
});
