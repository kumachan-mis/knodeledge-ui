import { GraphActionError } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { useMenu } from '@/hooks/menu';
import { SectionOfChapter } from '@/openapi';
import { CHAPTER_ID_PARAM_KEY, PROJECTS_ID_PATH_NAME, SECTION_ID_PARAM_KEY } from '@/utils/page';

import SectionListItemMenuComponent from './SectionListItemMenu';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

export type SectionListItemProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly section: SectionOfChapter;
  readonly onDeleteSection: () => Promise<LoadableAction<GraphActionError>>;
};

const SectionListItem: React.FC<SectionListItemProps> = ({ projectId, chapterId, section, onDeleteSection }) => {
  const {
    open: sectionMenuOpen,
    anchorEl: sectionMenuAnchorEl,
    onOpen: onOpenSectionMenu,
    onClose: onCloseSectionMenu,
  } = useMenu();

  return (
    <ListItem
      key={section.id}
      secondaryAction={
        <IconButton
          aria-controls={sectionMenuOpen ? `section-list-item-menu-${section.name}` : undefined}
          aria-expanded={sectionMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
          aria-label="section menu"
          edge="end"
          id={`section-list-item-buttom-${section.name}`}
          onClick={onOpenSectionMenu}
        >
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemButton
        LinkComponent={Link}
        href={`/${PROJECTS_ID_PATH_NAME}/${projectId}?${CHAPTER_ID_PARAM_KEY}=${chapterId}&${SECTION_ID_PARAM_KEY}=${section.id}`}
      >
        <ListItemText slotProps={{ primary: { variant: 'subtitle2' } }}>{section.name}</ListItemText>
      </ListItemButton>
      <SectionListItemMenuComponent
        anchorEl={sectionMenuAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        aria-labelledby={`section-list-item-buttom-${section.name}`}
        id={`section-list-item-menu-${section.name}`}
        onClose={onCloseSectionMenu}
        onDeleteSection={onDeleteSection}
        open={sectionMenuOpen}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </ListItem>
  );
};

export default SectionListItem;
