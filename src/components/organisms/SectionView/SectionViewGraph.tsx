'use client';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/openapi/graphs';
import { useGraphContent } from '@/contexts/views/graph';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const graphRoot = loadableGraph.data?.name ?? '';
  const graph = useGraphContent();

  return <AppGraph graphChildren={graph.children} graphRoot={graphRoot} state={loadableGraph.state} />;
};

export default SectionViewGraphComponent;
