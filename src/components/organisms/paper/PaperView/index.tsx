import { useLoadablePaper, useUpdatePaper } from '@/contexts/papers';

import PaperViewComponent from './PaperView';

import { Claims } from '@auth0/nextjs-auth0';

export type PaperViewProps = {
  user: Claims;
  projectId: string;
  chapterId: string;
};

const PaperView: React.FC<PaperViewProps> = ({ user, projectId, chapterId }) => {
  const loadablePaper = useLoadablePaper(chapterId);
  const updatePaper = useUpdatePaper({ id: user.sub }, projectId, chapterId);
  return <PaperViewComponent loadablePaper={loadablePaper} updatePaper={updatePaper} />;
};

export default PaperView;
