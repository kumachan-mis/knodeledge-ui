import { PaperWithoutAutofield, SectionWithoutAutofield } from '@/openapi';

import React from 'react';
import { headingContent, parseText, textNodeToString } from 'react-clay-editor';

export type UsePaperSectionsProps = {
  paper: PaperWithoutAutofield;
};

export type UsePaperSectionsReturn = {
  sections: SectionWithoutAutofield[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  errorMessage: string;
};

export function usePaperSections({ paper }: UsePaperSectionsProps): UsePaperSectionsReturn {
  const nodes = React.useMemo(() => parseText(paper.content, {}), [paper.content]);

  const [page, setPage] = React.useState(1);

  if (nodes.length === 0 || nodes[0].type !== 'heading' || nodes[0].children[0].config.size !== 'larger') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return { sections: [], page: 0, setPage: () => {}, errorMessage: 'content should start with a section heading' };
  }

  if (nodes.some((node) => node.type === 'heading' && node.children[0].config.size === 'largest')) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return { sections: [], page: 0, setPage: () => {}, errorMessage: 'content should not have chapter headings' };
  }

  const sections: SectionWithoutAutofield[] = [];
  for (const node of nodes) {
    if (node.type === 'heading' && node.children[0].config.size === 'larger') {
      const sectionName = headingContent(node);
      if (!sectionName) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return { sections: [], page: 0, setPage: () => {}, errorMessage: 'section name should not be empty' };
      }
      sections.push({ name: sectionName, content: '' });
      continue;
    }

    const section = sections[sections.length - 1];
    if (section.content) section.content += '\n';
    section.content += textNodeToString(node);
  }

  if (sections.length !== new Set(sections.map((section) => section.name)).size) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return { sections: [], page: 0, setPage: () => {}, errorMessage: 'section name should not be duplicated' };
  }

  return { sections, page, setPage, errorMessage: '' };
}
