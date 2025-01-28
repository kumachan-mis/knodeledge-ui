'use client';
import React from 'react';

export type StarGraphRoot = {
  readonly name: string;
};

export type StarGraphRootWithId = StarGraphRoot & {
  readonly id: string;
};

export type StarGraphChild = {
  readonly name: string;
  readonly relation: string;
  readonly description: string;
  readonly children: StarGraphChild[];
};

export type StarGraphChildOfArg = {
  readonly name: string;
  readonly relation?: string;
  readonly description?: string;
};

export type StarGraphChildWithId = Omit<StarGraphChild, 'children'> & {
  readonly id: string;
  readonly children: StarGraphChildWithId[];
};

export type StarGraphContent = {
  readonly graphRootChildren: StarGraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
};

const StarGraphRootContext = React.createContext<StarGraphRootWithId>({
  id: '',
  name: '',
});

const StarGraphContentContext = React.createContext<StarGraphContent>({
  graphRootChildren: [],
  focusedGraphParentId: '',
  focusedGraphChildId: '',
});

const StarGraphContentSetContext = React.createContext<React.Dispatch<React.SetStateAction<StarGraphContent>>>(() => {
  // Do nothing
});

export function useStarGraphRoot(): StarGraphRootWithId {
  return React.useContext(StarGraphRootContext);
}

export function useStarGraphContent(): StarGraphContent {
  return React.useContext(StarGraphContentContext);
}

export function useSetStarGraphContent(): React.Dispatch<React.SetStateAction<StarGraphContent>> {
  return React.useContext(StarGraphContentSetContext);
}

export const StarGraphContentProvider: React.FC<{
  readonly graphRoot: StarGraphRoot;
  readonly graphRootChildren: StarGraphChild[];
  readonly children?: React.ReactNode;
}> = ({ children, graphRoot, graphRootChildren }) => {
  const graphRootWithId: StarGraphRootWithId = React.useMemo(() => issueStarGraphRootId(graphRoot), [graphRoot]);

  const [content, setContent] = React.useState({
    graphRootChildren: graphRootChildren.map(issueStarGraphChildId),
    focusedGraphParentId: graphRootWithId.id,
    focusedGraphChildId: '',
  });

  return (
    <StarGraphRootContext.Provider value={graphRootWithId}>
      <StarGraphContentSetContext.Provider value={setContent}>
        <StarGraphContentContext.Provider value={content}>{children}</StarGraphContentContext.Provider>
      </StarGraphContentSetContext.Provider>
    </StarGraphRootContext.Provider>
  );
};

export function starGraphChildOf(child: StarGraphChildOfArg): StarGraphChildWithId {
  return { id: starGraphId(), relation: '', description: '', children: [], ...child };
}

function issueStarGraphRootId(root: StarGraphRoot): StarGraphRootWithId {
  return { ...root, id: starGraphId() };
}

function issueStarGraphChildId(child: StarGraphChild): StarGraphChildWithId {
  return { ...child, id: starGraphId(), children: child.children.map(issueStarGraphChildId) };
}

function starGraphId(): string {
  return Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(16);
}
