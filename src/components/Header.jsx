import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';

const navItems = [
  { text: 'Home', icon: <HomeIcon />, href: '#hero' },
  { text: 'About', icon: <PersonIcon />, href: '#about' },
  { text: 'Experience', icon: <WorkIcon />, href: '#experience' },
  { text: 'Skills', icon: <ConstructionIcon />, href: '#skills' },
  { text: 'Contact', icon: <EmailIcon />, href: '#contact' },
];

export default function Header({ name }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const drawer = (
    <Box 
      sx={{ 
        width: 280, 
        p: 2,
        backgroundColor: 'background.default',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleDrawerToggle} aria-label="close navigation">
          <CloseIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.href)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(0, 217, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'rgba(10, 22, 40, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
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

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open navigation"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'primary.main' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <IconButton
                  key={item.text}
                  onClick={() => handleNavClick(item.href)}
                  sx={{
                    color: 'text.primary',
                    borderRadius: 2,
                    px: 2,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'rgba(0, 217, 255, 0.08)',
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {item.text}
                  </Typography>
                </IconButton>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.default',
            borderLeft: '1px solid rgba(0, 217, 255, 0.2)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
}
