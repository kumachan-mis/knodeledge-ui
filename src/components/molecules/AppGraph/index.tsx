'use client';
import { GraphChild } from '@/openapi/models/GraphChild';

import { graphEntityLogic } from './GraphEntityLogic';
import GraphLinkLogic from './GraphLinkLogic';
import GraphMenuLogic from './GraphMenuLogic';
import GraphNodeLogic from './GraphNodeLogic';
import GraphSimulationLogic from './GraphSimulationLogic';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { select } from 'd3-selection';
import React from 'react';

export type AppGraphProps = {
  readonly graphRoot: string;
  readonly graphChildren: GraphChild[];
  readonly focusedGraphChildIndex: number;
  readonly setGraphChildren: React.Dispatch<React.SetStateAction<GraphChild[]>>;
  readonly setFocusedGraphChildIndex: React.Dispatch<React.SetStateAction<number>>;
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppGraph: React.FC<AppGraphProps> = ({
  graphChildren,
  focusedGraphChildIndex,
  setGraphChildren,
  state,
  ...rest
}) => (
  <AppGraphRoot>
    {state !== 'success' ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        {state === 'loading' && <CircularProgress />}
      </Box>
    ) : (
      <AppGraphEditor
        focusedGraphChildIndex={focusedGraphChildIndex}
        graphChildren={graphChildren}
        setGraphChildren={setGraphChildren}
        {...rest}
      />
    )}
  </AppGraphRoot>
);

const AppGraphEditor: React.FC<Omit<AppGraphProps, 'state'>> = ({
  graphRoot,
  graphChildren,
  focusedGraphChildIndex,
  setGraphChildren,
  setFocusedGraphChildIndex,
}) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const simulationLogicRef = React.useRef(new GraphSimulationLogic());
  const menuLogicRef = React.useRef(new GraphMenuLogic(simulationLogicRef.current));
  const linkLogicRef = React.useRef(new GraphLinkLogic(menuLogicRef.current));
  const nodeLogicRef = React.useRef(new GraphNodeLogic(menuLogicRef.current, simulationLogicRef.current));
  const timerIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const svgSelection = select(ref.current);

    const simulationLogic = simulationLogicRef.current;
    const linkLogic = linkLogicRef.current;
    const nodeLogic = nodeLogicRef.current;

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
    if (!ref.current) return;

    const simulationLogic = simulationLogicRef.current;
    const linkLogic = linkLogicRef.current;
    const nodeLogic = nodeLogicRef.current;

    const graphEntityLogicReturn = graphEntityLogic({
      graphRoot,
      graphChildren,
      focusedGraphChildIndex,
      setGraphChildren,
      setFocusedGraphChildIndex,
      center: { x: ref.current.clientWidth / 2, y: ref.current.clientHeight / 2 },
    });

    linkLogic.update(graphEntityLogicReturn);
    nodeLogic.update(graphEntityLogicReturn);
    simulationLogic.update(graphEntityLogicReturn);
  }, [focusedGraphChildIndex, graphChildren, graphRoot, setFocusedGraphChildIndex, setGraphChildren]);

  React.useEffect(handleOnRerenderGraph, [handleOnRerenderGraph]);

  const handleResizeGraph = React.useCallback(() => {
    if (timerIdRef.current > 0) clearTimeout(timerIdRef.current);
    const simulationLogic = simulationLogicRef.current;

    timerIdRef.current = window.setTimeout(() => {
      handleOnRerenderGraph();
      simulationLogic.start();
    }, 300);
  }, [handleOnRerenderGraph]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResizeGraph);
    return () => {
      window.removeEventListener('resize', handleResizeGraph);
    };
  }, [handleResizeGraph]);

  const focusedGraphChild = graphChildren[focusedGraphChildIndex] as GraphChild | undefined;
  const setFocusedGraphChild = React.useCallback(
    (value: React.SetStateAction<GraphChild>) => {
      setGraphChildren((prev) => {
        const next = [...prev];
        const updated = typeof value === 'function' ? value(next[focusedGraphChildIndex]) : value;
        next[focusedGraphChildIndex] = updated;
        return next;
      });
    },
    [focusedGraphChildIndex, setGraphChildren],
  );

  const [prevFocusedGraphChildIndex, setPrevFocusedGraphChildIndex] = React.useState<number>(focusedGraphChildIndex);
  const prevFocusedGraphChild = graphChildren[prevFocusedGraphChildIndex] as GraphChild | undefined;
  if (prevFocusedGraphChildIndex !== focusedGraphChildIndex) {
    setPrevFocusedGraphChildIndex(focusedGraphChildIndex);
    if ((!prevFocusedGraphChild && focusedGraphChild) || (prevFocusedGraphChild && !focusedGraphChild)) {
      handleResizeGraph();
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <svg height="100%" ref={ref} width="100%" />
      {focusedGraphChild && <AppGraphChildEditor graphChild={focusedGraphChild} setGraphChild={setFocusedGraphChild} />}
    </Box>
  );
};

const AppGraphChildEditor: React.FC<{
  readonly graphChild: GraphChild;
  readonly setGraphChild: React.Dispatch<React.SetStateAction<GraphChild>>;
}> = ({ graphChild, setGraphChild }) => (
  <Grid container my={1} spacing={1}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, name: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.name}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, relation: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.relation}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, description: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.description}
      />
    </Grid>
  </Grid>
);

const AppGraphRoot = styled('div')({
  '&': {
    width: '100%',
    height: '80%',
  },
});

export default AppGraph;
