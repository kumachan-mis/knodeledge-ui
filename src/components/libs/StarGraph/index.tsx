'use client';
import GraphLinkLogic from './GraphLinkLogic';
import GraphMenuLogic from './GraphMenuLogic';
import GraphNodeLogic from './GraphNodeLogic';
import GraphSimulationLogic from './GraphSimulationLogic';
import { StarGraphChildWithId, StarGraphRootWithId } from './context';
import { useGraphEntity } from './graphEntity.hooks';

import { select } from 'd3-selection';
import React from 'react';

export type StarGraphProps = {
  readonly graphRoot: StarGraphRootWithId;
  readonly graphRootChildren: StarGraphChildWithId[];
  readonly focusedGraphParentId: string;
  readonly focusedGraphChildId: string;
  readonly setGraphRootChildren: React.Dispatch<React.SetStateAction<StarGraphChildWithId[]>>;
  readonly setFocusedGraphParentId: React.Dispatch<React.SetStateAction<string>>;
  readonly setFocusedGraphChildId: React.Dispatch<React.SetStateAction<string>>;
};

const StarGraph: React.FC<StarGraphProps> = (props) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const simulationLogicRef = React.useRef(new GraphSimulationLogic());
  const menuLogicRef = React.useRef(new GraphMenuLogic(simulationLogicRef.current));
  const linkLogicRef = React.useRef(new GraphLinkLogic(menuLogicRef.current));
  const nodeLogicRef = React.useRef(new GraphNodeLogic(menuLogicRef.current, simulationLogicRef.current));
  const timerIdRef = React.useRef<number>(0);

  const graphEntity = useGraphEntity(props);

  React.useEffect(() => {
    if (!ref.current) return;
    const svgSelection = select(ref.current);

    const simulationLogic = simulationLogicRef.current;
    const linkLogic = linkLogicRef.current;
    const nodeLogic = nodeLogicRef.current;

    linkLogic.initLink(svgSelection);
    nodeLogic.initNode(svgSelection);
    linkLogic.initDesc(svgSelection);

    simulationLogic.init(svgSelection, () => {
      linkLogic.onTick();
      nodeLogic.onTick();
    });

    return () => {
      simulationLogic.destroy();
      nodeLogic.destroy(graphEntity);
      linkLogic.destroy(graphEntity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnRerenderGraph = React.useCallback(() => {
    if (!ref.current) return;

    const simulationLogic = simulationLogicRef.current;
    const linkLogic = linkLogicRef.current;
    const nodeLogic = nodeLogicRef.current;

    linkLogic.update(graphEntity);
    nodeLogic.update(graphEntity);
    simulationLogic.update(graphEntity);
  }, [graphEntity]);

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
