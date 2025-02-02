'use client';
import { useStarGraph } from '@/components/libs/StarGraph/hooks';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/openapi/graphs';

import styled from '@emotion/styled';
import React from 'react';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const starGraphProps = useStarGraph();

  return (
    <SectionViewGraphRootComponent>
      <AppGraph {...starGraphProps} state={loadableGraph.state} />
    </SectionViewGraphRootComponent>
  );
};

const SectionViewGraphRootComponent = styled.div({
  '&': {
    width: '100%',
    height: 0,
    flexGrow: 4,
    flexShrink: 4,
  },
});

export default SectionViewGraphComponent;
