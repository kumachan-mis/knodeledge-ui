'use client';
import {
  StarGraphChildWithId,
  starGraphId,
  useSetStarGraphContent,
  useStarGraphContent,
  useStarGraphRoot,
} from '@/components/libs/StarGraph/context';
import AppEditor from '@/components/molecules/AppEditor';
import { LoadableGraph } from '@/contexts/openapi/graphs';
import { useGraphParagraph, useSetGraphParagraph } from '@/contexts/views/graph';

import styles from './styles.module.scss';

import styled from '@emotion/styled';
import React from 'react';

export type SectionViewEditorComponentProps = {
  readonly loadableGraph: LoadableGraph;
  readonly view: 'text' | 'graph';
};

const APP_EDITOR_MMODE = { text: 'regular', graph: 'simple' } as const;

const SectionViewEditorComponent: React.FC<SectionViewEditorComponentProps> = ({ loadableGraph, view }) => {
  const graphParagraph = useGraphParagraph();
  const setGraphParagraph = useSetGraphParagraph();

  const graphRoot = useStarGraphRoot();
  const graph = useStarGraphContent();
  const setGraph = useSetStarGraphContent();

  const graphNodeNames = React.useMemo(() => {
    const result = new Set<string>([graphRoot.name]);
    const queue = [...graph.graphRootChildren];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node) continue;
      result.add(node.name);
      queue.push(...node.children);
    }
    return result;
  }, [graphRoot.name, graph.graphRootChildren]);

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setGraphParagraph((prev) => {
        const updated = typeof value === 'function' ? value(prev.paragraph) : value;
        return { paragraph: updated };
      });
    },
    [setGraphParagraph],
  );

  const hashtagAnchorProps = React.useCallback(
    (linkName: string, clickable: boolean): React.PropsWithoutRef<React.ComponentProps<'a'>> => ({
      className: (() => {
        if (graphNodeNames.has(linkName)) return undefined;
        const classNames = [styles['SectionViewEditor_hashtag--unused']];
        if (clickable) classNames.push(styles['SectionViewEditor_hashtag--clickable']);
        return classNames.join(' ');
      })(),
      onClick: (event) => {
        event.preventDefault();
        if (!clickable) return;

        const graphChild: StarGraphChildWithId = {
          id: starGraphId(),
          name: linkName,
          relation: '',
          description: '',
          children: [],
        };
        setGraph((prev) => {
          const focusedParent = prev.graphRootChildren.find((child) => child.id === prev.focusedGraphParentId);
          if (!focusedParent) {
            if ([graphRoot, ...prev.graphRootChildren].some((node) => node.name === graphChild.name)) {
              return prev;
            }
            return {
              ...prev,
              graphRootChildren: [...prev.graphRootChildren, graphChild],
              focusedGraphChildId: graphChild.id,
            };
          }

          if ([focusedParent, ...focusedParent.children].some((node) => node.name === graphChild.name)) {
            return prev;
          }
          const updated = prev.graphRootChildren.map((child) => {
            if (child !== focusedParent) return child;
            return { ...child, children: [...child.children, graphChild] };
          });
          return { ...prev, graphRootChildren: updated, focusedGraphChildId: graphChild.id };
        });
      },
    }),
    [setGraph, graphRoot, graphNodeNames],
  );

  return (
    <SectionViewEditorRootComponent view={view}>
      <AppEditor
        hashtagProps={{ anchorProps: hashtagAnchorProps }}
        mode={APP_EDITOR_MMODE[view]}
        setText={setText}
        state={loadableGraph.state}
        text={graphParagraph.paragraph}
      />
    </SectionViewEditorRootComponent>
  );
};

const SectionViewEditorRootComponent = styled.div<{ view: 'text' | 'graph' }>(({ view }) => ({
  '&': {
    width: '100%',
    height: view === 'graph' ? '20%' : '100%',
  },
}));

export default SectionViewEditorComponent;
