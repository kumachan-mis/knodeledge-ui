import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export type ProjectDrawerMenuProps = {
  onMobileToggle: () => void;
};

const ProjectDrawerMenu: React.FC<ProjectDrawerMenuProps> = ({ onMobileToggle }) => (
  <IconButton
    aria-label="open drawer"
    color="inherit"
    edge="start"
    onClick={onMobileToggle}
    sx={{ mr: 2, display: { sm: 'none' } }}
  >
    <MenuIcon />
  </IconButton>
);

export default ProjectDrawerMenu;
