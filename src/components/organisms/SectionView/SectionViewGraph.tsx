'use client';
import { useSetStarGraphContent, useStarGraphContent, useStarGraphRoot } from '@/components/libs/StarGraph/context';
import { StarGraphContent, useStarGraph } from '@/components/libs/StarGraph/hooks';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/openapi/graphs';

import styled from '@emotion/styled';
import React from 'react';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const graphRoot = useStarGraphRoot();
  const graphContent = useStarGraphContent();
  const setGraph = useSetStarGraphContent();

  const setGraphContent = React.useCallback(
    (value: React.SetStateAction<StarGraphContent>) => {
      setGraph((prev) => {
        const updated = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...updated };
      });
    },
    [setGraph],
  );

  const starGraphProps = useStarGraph({ graphRoot, graphContent, setGraphContent });

  return (
    <SectionViewGraphRootComponent>
      <AppGraph {...starGraphProps} state={loadableGraph.state} />
    </SectionViewGraphRootComponent>
  );
};

const SectionViewGraphRootComponent = styled.div({
  '&': {
    width: '100%',
    height: '80%',
  },
});

export default SectionViewGraphComponent;
