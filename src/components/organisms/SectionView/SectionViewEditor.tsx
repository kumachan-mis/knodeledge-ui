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

import { styled } from '@mui/material/styles';
import React from 'react';

export type SectionViewEditorComponentProps = {
  readonly loadableGraph: LoadableGraph;
  readonly view: 'article' | 'graph';
};

const APP_EDITOR_MMODE = { article: 'regular', graph: 'simple' } as const;

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
    <SectionViewEditorRootComponent>
      <AppEditor
        bracketLinkProps={{ anchorProps: bracketLinkAnchorProps }}
        mode={APP_EDITOR_MMODE[view]}
        setText={setText}
        state={loadableGraph.state}
        text={graph.paragraph}
      />
    </SectionViewEditorRootComponent>
  );
};

const SectionViewEditorRootComponent = styled('div')({
  '&': {
    width: '100%',
    height: '20%',
  },
});

export default SectionViewEditorComponent;
