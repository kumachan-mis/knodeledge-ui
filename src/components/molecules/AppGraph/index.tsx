'use client';
import { GraphChildWithId, GraphRootWithId } from '@/contexts/views/graph';

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
  readonly graphRoot: GraphRootWithId;
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<GraphChildWithId[]>>;
  readonly setFocusedGraphParentId: React.Dispatch<React.SetStateAction<string>>;
  readonly setFocusedGraphChildId: React.Dispatch<React.SetStateAction<string>>;
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppGraph: React.FC<AppGraphProps> = ({
  graphRootChildren,
  focusedGraphChildId,
  setFocusedGraphChildren,
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
        focusedGraphChildId={focusedGraphChildId}
        graphRootChildren={graphRootChildren}
        setFocusedGraphChildren={setFocusedGraphChildren}
        {...rest}
      />
    )}
  </AppGraphRoot>
);

const AppGraphEditor: React.FC<Omit<AppGraphProps, 'state'>> = ({
  graphRoot,
  graphRootChildren,
  focusedGraphParentId,
  focusedGraphChildId,
  setFocusedGraphChildren,
  setFocusedGraphParentId,
  setFocusedGraphChildId,
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

    const clientRect = ref.current.getBoundingClientRect();
    const graphEntityLogicReturn = graphEntityLogic({
      graphRoot,
      graphRootChildren,
      focusedGraphParentId,
      focusedGraphChildId,
      setFocusedGraphChildren,
      setFocusedGraphParentId,
      setFocusedGraphChildId,
      center: { x: clientRect.width / 2, y: clientRect.height / 2 },
    });

    linkLogic.update(graphEntityLogicReturn);
    nodeLogic.update(graphEntityLogicReturn);
    simulationLogic.update(graphEntityLogicReturn);
  }, [
    focusedGraphChildId,
    focusedGraphParentId,
    graphRoot,
    graphRootChildren,
    setFocusedGraphChildId,
    setFocusedGraphParentId,
    setFocusedGraphChildren,
  ]);

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

  const focusedGraphChild = graphRootChildren.find((child) => child.id === focusedGraphChildId);
  const setFocusedGraphChild = React.useCallback(
    (value: React.SetStateAction<GraphChildWithId>) => {
      setFocusedGraphChildren((prev) => {
        const prevFocusedGraphChild = prev.find((child) => child.id === focusedGraphChildId);
        if (!prevFocusedGraphChild) return prev;
        const updated = typeof value === 'function' ? value(prevFocusedGraphChild) : value;
        return prev.map((child) => (child.id === focusedGraphChildId ? updated : child));
      });
    },
    [focusedGraphChildId, setFocusedGraphChildren],
  );

  const [prevFocusedGraphChildId, setPrevFocusedGraphChildId] = React.useState<string>(focusedGraphChildId);
  const prevFocusedGraphChild = graphRootChildren.find((child) => child.id === prevFocusedGraphChildId);
  if (prevFocusedGraphChildId !== focusedGraphChildId) {
    setPrevFocusedGraphChildId(focusedGraphChildId);
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
  readonly graphChild: GraphChildWithId;
  readonly setGraphChild: React.Dispatch<React.SetStateAction<GraphChildWithId>>;
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
