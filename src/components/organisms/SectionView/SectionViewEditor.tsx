'use client';
import { graphChildOf } from '@/components/libs/StarGraph/context';
import { useFocusedGraph } from '@/components/libs/StarGraph/focusedGraph.hooks';
import { useStarGraph } from '@/components/libs/StarGraph/hooks';
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

  const props = useStarGraph();
  const { graphRoot, graphRootChildren, setFocusedGraphChildId } = props;
  const { focusedGraphParent, setFocusedGraphChildren } = useFocusedGraph(props);

  const graphNodeNames = React.useMemo(() => {
    const result = new Set<string>([graphRoot.name]);
    const queue = [...graphRootChildren];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node) continue;
      result.add(node.name);
      queue.push(...node.children);
    }
    return result;
  }, [graphRoot, graphRootChildren]);

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
        const graphChild = graphChildOf({ name: linkName });
        setFocusedGraphChildren((prev) => {
          const nodeExists = [focusedGraphParent, ...prev].some((node) => node.name === graphChild.name);
          return nodeExists ? prev : [...prev, graphChild];
        });
        setFocusedGraphChildId(graphChild.id);
      },
    }),
    [focusedGraphParent, graphNodeNames, setFocusedGraphChildId, setFocusedGraphChildren],
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
