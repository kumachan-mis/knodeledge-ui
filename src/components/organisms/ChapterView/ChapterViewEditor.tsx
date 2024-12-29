'use client';
import AppEditor from '@/components/molecules/AppEditor';
import { LoadablePaper } from '@/contexts/papers';
import { usePaperContent, useSetPaperContent } from '@/contexts/views';

import React from 'react';

export type ChapterViewEditorComponentProps = {
  readonly loadablePaper: LoadablePaper;
};

const ChapterViewEditorComponent: React.FC<ChapterViewEditorComponentProps> = ({ loadablePaper }) => {
  const paper = usePaperContent();
  const setPaper = useSetPaperContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (typeof value === 'function') {
        setPaper((prev) => ({ ...prev, content: value(prev.content) }));
        return;
      }
      setPaper({ content: value });
    },
    [setPaper],
  );

  return <AppEditor loading={loadablePaper.state === 'loading'} setText={setText} text={paper.content} />;
};

export default ChapterViewEditorComponent;
