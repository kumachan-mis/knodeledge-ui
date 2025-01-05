'use client';
import AppEditor from '@/components/molecules/AppEditor';
import { LoadableGraph } from '@/contexts/openapi/graphs';
import {
  generateGraphChildId,
  GraphChildWithId,
  useGraphContent,
  useGraphContentRoot,
  useSetGraphContent,
} from '@/contexts/views/graph';

import React from 'react';

export type SectionViewEditorComponentProps = {
  readonly loadableGraph: LoadableGraph;
  readonly view: 'article' | 'graph';
};

const SectionViewEditorComponent: React.FC<SectionViewEditorComponentProps> = ({ loadableGraph, view }) => {
  const graphRoot = useGraphContentRoot();
  const graph = useGraphContent();
  const setGraph = useSetGraphContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.paragraph) : value;
        return { ...prev, paragraph: updated };
      });
    },
    [setGraph],
  );

  const bracketLinkAnchorProps = React.useCallback(
    (linkName: string, clickable: boolean): React.PropsWithoutRef<React.ComponentProps<'a'>> => ({
      onClick: (event) => {
        event.preventDefault();
        if (!clickable) return;

        const graphChild: GraphChildWithId = {
          id: generateGraphChildId(),
          name: linkName,
          relation: '',
          description: '',
          children: [],
        };
        setGraph((prev) => {
          const focusedParent = prev.rootChildren.find((child) => child.id === prev.focusedParentId);
          if (!focusedParent) {
            if ([graphRoot, ...prev.rootChildren].some((node) => node.name === graphChild.name)) {
              return prev;
            }
            return { ...prev, rootChildren: [...prev.rootChildren, graphChild] };
          }

          if ([focusedParent, ...focusedParent.children].some((node) => node.name === graphChild.name)) {
            return prev;
          }
          const updated = prev.rootChildren.map((child) => {
            if (child !== focusedParent) return child;
            return { ...child, children: [...child.children, graphChild] };
          });
          return { ...prev, rootChildren: updated };
        });
      },
    }),
    [setGraph, graphRoot],
  );

  return (
    <AppEditor
      bracketLinkProps={{ anchorProps: bracketLinkAnchorProps }}
      setText={setText}
      state={loadableGraph.state}
      text={graph.paragraph}
      view={view}
    />
  );
};

export default SectionViewEditorComponent;
