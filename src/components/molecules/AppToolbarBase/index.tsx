import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type AppToolbarBaseProps = {
  readonly menu?: React.ReactNode;
  readonly children?: React.ReactNode;
};

const AppToolbarBase: React.FC<AppToolbarBaseProps> = ({ menu, children }) => (
  <Toolbar variant="dense">
    {menu}
    <Box sx={{ flexGrow: 1 }}>
      <Button LinkComponent={Link} color="inherit" href="/" sx={{ textTransform: 'none' }}>
        <Typography component="div" variant="h6">
          kNODEledge
        </Typography>
      </Button>
    </Box>
    {children}
  </Toolbar>
);

export default AppToolbarBase;
