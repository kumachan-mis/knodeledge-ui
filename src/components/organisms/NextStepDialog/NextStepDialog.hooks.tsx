import { usePaperContent } from '@/contexts/views';
import { SectionWithoutAutofield } from '@/openapi';

import React from 'react';
import { headingContent, parseText, textNodeToString } from 'react-clay-editor';

export function usePaperSections(): [SectionWithoutAutofield[], number, React.Dispatch<React.SetStateAction<number>>] {
  const paper = usePaperContent();
  const nodes = React.useMemo(() => parseText(paper.content, {}), [paper.content]);

  const [page, setPage] = React.useState(1);

  if (nodes.length === 0 || nodes[0].type !== 'heading') {
    setPage(0);
    return [[], page, setPage];
  }

  const sections: SectionWithoutAutofield[] = [];
  for (const node of nodes) {
    if (node.type === 'heading') {
      sections.push({ name: headingContent(node), content: '' });
      continue;
    }

    const section = sections[sections.length - 1];
    if (section.content) section.content += '\n';
    section.content += textNodeToString(node);
  }

  return [sections, page, setPage];
}
