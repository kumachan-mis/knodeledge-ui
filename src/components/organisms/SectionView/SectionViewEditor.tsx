'use client';
import AppEditor from '@/components/molecules/AppEditor';
import { LoadableGraph } from '@/contexts/graphs';
import { useGraphContent, useSetGraphContent } from '@/contexts/views';

import React from 'react';

export type SectionViewEditorComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewEditorComponent: React.FC<SectionViewEditorComponentProps> = ({ loadableGraph }) => {
  const graph = useGraphContent();
  const setGraph = useSetGraphContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (typeof value === 'function') {
        setGraph((prev) => ({ ...prev, paragraph: value(prev.paragraph) }));
        return;
      }
      setGraph((prev) => ({ ...prev, paragraph: value }));
    },
    [setGraph],
  );

  return <AppEditor setText={setText} state={loadableGraph.state} text={graph.paragraph} />;
};

export default SectionViewEditorComponent;
