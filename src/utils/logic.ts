import { GraphChild, GraphContentWithoutAutofield, PaperWithoutAutofield } from '@/openapi';

export function chapterViewContentEquals(a: PaperWithoutAutofield, b: PaperWithoutAutofield): boolean {
  return a.content === b.content;
}

export function sectionViewContentEquals(a: GraphContentWithoutAutofield, b: GraphContentWithoutAutofield): boolean {
  return a.paragraph === b.paragraph && graphChildrenEquals(a.children, b.children);
}

function graphChildrenEquals(a: GraphChild[], b: GraphChild[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (!graphChildEquals(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

function graphChildEquals(a: GraphChild, b: GraphChild): boolean {
  return (
    a.name === b.name &&
    a.relation === b.relation &&
    a.description === b.description &&
    graphChildrenEquals(a.children, b.children)
  );
}
