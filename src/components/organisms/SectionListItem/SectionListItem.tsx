import { SectionOfChapter } from '@/openapi';
import { CHAPTER_ID_PARAM_KEY, PROJECTS_ID_PATH_NAME, SECTION_ID_PARAM_KEY } from '@/utils/page';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

export type SectionListItemProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly section: SectionOfChapter;
};

const SectionListItem: React.FC<SectionListItemProps> = ({ projectId, chapterId, section }) => (
  <ListItem>
    <ListItemButton
      LinkComponent={Link}
      href={`/${PROJECTS_ID_PATH_NAME}/${projectId}?${CHAPTER_ID_PARAM_KEY}=${chapterId}&${SECTION_ID_PARAM_KEY}=${section.id}`}
    >
      <ListItemText slotProps={{ primary: { variant: 'subtitle2' } }}>{section.name}</ListItemText>
    </ListItemButton>
  </ListItem>
);

export default SectionListItem;
