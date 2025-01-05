'use client';
import AppEditor from '@/components/molecules/AppEditor';
import { LoadablePaper } from '@/contexts/openapi/papers';
import { usePaperContent, useSetPaperContent } from '@/contexts/views/paper';

import React from 'react';

export type ChapterViewEditorComponentProps = {
  readonly loadablePaper: LoadablePaper;
};

const ChapterViewEditorComponent: React.FC<ChapterViewEditorComponentProps> = ({ loadablePaper }) => {
  const paper = usePaperContent();
  const setPaper = useSetPaperContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      setPaper((prev) => {
        const updated = typeof value === 'function' ? value(prev.content) : value;
        return { ...prev, content: updated };
      });
    },
    [setPaper],
  );

  return <AppEditor setText={setText} state={loadablePaper.state} text={paper.content} />;
};

export default ChapterViewEditorComponent;
