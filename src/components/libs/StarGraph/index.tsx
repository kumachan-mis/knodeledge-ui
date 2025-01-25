'use client';
import GraphChildWithId from './GraphChildWithId';
import { graphEntityLogic } from './GraphEntityLogic';
import GraphLinkLogic from './GraphLinkLogic';
import GraphMenuLogic from './GraphMenuLogic';
import GraphNodeLogic from './GraphNodeLogic';
import GraphRootWithId from './GraphRootWithId';
import GraphSimulationLogic from './GraphSimulationLogic';

import { select } from 'd3-selection';
import React from 'react';

export type StarGraphProps = {
  readonly graphRoot: GraphRootWithId;
  readonly graphRootChildren: GraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
  readonly setFocusedGraphChildren: React.Dispatch<React.SetStateAction<GraphChildWithId[]>>;
  readonly setFocusedGraphParentId: React.Dispatch<React.SetStateAction<string>>;
  readonly setFocusedGraphChildId: React.Dispatch<React.SetStateAction<string>>;
};

const StarGraph: React.FC<StarGraphProps> = ({
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
  const centerRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!ref.current) return;
    const svgSelection = select(ref.current);

    const simulationLogic = simulationLogicRef.current;
    const linkLogic = linkLogicRef.current;
    const nodeLogic = nodeLogicRef.current;

    linkLogic.initLink(svgSelection);
    nodeLogic.initNode(svgSelection);
    linkLogic.initDesc(svgSelection);

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
    const center: { x: number; y: number } = { x: clientRect.width / 2, y: clientRect.height / 2 };

    const graphEntityLogicReturn = graphEntityLogic({
      graphRoot,
      graphRootChildren,
      focusedGraphParentId,
      focusedGraphChildId,
      setFocusedGraphChildren,
      setFocusedGraphParentId,
      setFocusedGraphChildId,
      center,
    });

    linkLogic.update(graphEntityLogicReturn);
    nodeLogic.update(graphEntityLogicReturn);
    simulationLogic.update(graphEntityLogicReturn);

    if (center.x !== centerRef.current.x || center.y !== centerRef.current.y) {
      simulationLogic.start();
      centerRef.current = center;
    }
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

  return <svg height="100%" ref={ref} width="100%" />;
};

export default StarGraph;
