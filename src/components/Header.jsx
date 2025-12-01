import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';



export default function Header({ name, onDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
        display: { xl: 'none' }
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {name}
        </Typography>

        <IconButton
          color="inherit"
          aria-label="open navigation"
          edge="end"
          onClick={onDrawerToggle}
          sx={{ color: 'primary.main' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
