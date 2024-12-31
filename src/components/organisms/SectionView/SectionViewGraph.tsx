'use client';
import AppGraph from '@/components/molecules/AppGraph';
import { LoadableGraph } from '@/contexts/graphs';
import { useGraphContent } from '@/contexts/views';

export type SectionViewGraphComponentProps = {
  readonly loadableGraph: LoadableGraph;
};

const SectionViewGraphComponent: React.FC<SectionViewGraphComponentProps> = ({ loadableGraph }) => {
  const graphParent = loadableGraph.data?.name ?? '';
  const graph = useGraphContent();

  return <AppGraph graphChildren={graph.children} graphParent={graphParent} state={loadableGraph.state} />;
};

export default SectionViewGraphComponent;
