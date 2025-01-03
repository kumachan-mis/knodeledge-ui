'use client';
import { GraphChild } from '@/openapi/models/GraphChild';

import { graphEntityLogic, GraphEntityLogicProps } from './GraphEntityLogic';
import GraphLinkLogic from './GraphLinkLogic';
import GraphNodeLogic from './GraphNodeLogic';
import GraphSimulationLogic from './GraphSimulationLogic';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { select } from 'd3-selection';
import React from 'react';

export type AppGraphProps = {
  readonly graphRoot: string;
  readonly graphChildren: GraphChild[];
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppGraphInner: React.FC<Omit<AppGraphProps, 'state'>> = ({ graphRoot, graphChildren }) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const graphSimulationLogicRef = React.useRef(new GraphSimulationLogic());
  const graphLinkLogicRef = React.useRef(new GraphLinkLogic());
  const graphNodeLogicRef = React.useRef(new GraphNodeLogic(graphSimulationLogicRef.current));
  const timerIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const svgSelection = select(ref.current);

    const simulationLogic = graphSimulationLogicRef.current;
    const linkLogic = graphLinkLogicRef.current;
    const nodeLogic = graphNodeLogicRef.current;

    linkLogic.init(svgSelection);
    nodeLogic.init(svgSelection);

    simulationLogic.init(() => {
      linkLogic.onTick();
      nodeLogic.onTick();
    });

    return () => {
      simulationLogic.destroy();
      nodeLogic.destroy();
      linkLogic.destroy();
    };
  }, []);

  const handleOnRerenderGraph = React.useCallback(() => {
    if (timerIdRef.current > 0) clearTimeout(timerIdRef.current);

    timerIdRef.current = window.setTimeout(() => {
      if (!ref.current) return;

      const simulationLogic = graphSimulationLogicRef.current;
      const linkLogic = graphLinkLogicRef.current;
      const nodeLogic = graphNodeLogicRef.current;

      const center = { x: ref.current.clientWidth / 2, y: ref.current.clientHeight / 2 };
      const graphEntityLogicProps: GraphEntityLogicProps = { graphRoot, graphChildren, center };
      const { graphParentNode, graphChildrenNodes, graphLinks } = graphEntityLogic(graphEntityLogicProps);

      linkLogic.update(graphLinks);
      nodeLogic.update(graphParentNode, graphChildrenNodes);
      simulationLogic.update(graphParentNode, graphChildrenNodes, graphLinks);

      simulationLogic.start();
    }, 100);

    return () => {
      if (timerIdRef.current > 0) clearTimeout(timerIdRef.current);
    };
  }, [graphChildren, graphRoot]);

  React.useEffect(handleOnRerenderGraph, [handleOnRerenderGraph]);

  React.useEffect(() => {
    window.addEventListener('resize', handleOnRerenderGraph);
    return () => {
      window.removeEventListener('resize', handleOnRerenderGraph);
    };
  }, [handleOnRerenderGraph]);

  return <svg height="100%" ref={ref} width="100%" />;
};

const AppGraph: React.FC<AppGraphProps> = ({ state, ...rest }) => {
  return (
    <AppGraphRoot>
      {state !== 'success' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {state === 'loading' && <CircularProgress />}
        </Box>
      ) : (
        <AppGraphInner {...rest} />
      )}
    </AppGraphRoot>
  );
};

const AppGraphRoot = styled('div')({
  '&&': {
    width: '100%',
    height: '70%',
  },
});

export default AppGraph;
