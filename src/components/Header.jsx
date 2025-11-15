import { useState, useEffect } from 'react';
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
import { motion, useScroll, useTransform } from 'framer-motion';

const navItems = [
  { text: 'Home', icon: <HomeIcon />, href: '#hero' },
  { text: 'About', icon: <PersonIcon />, href: '#about' },
  { text: 'Experience', icon: <WorkIcon />, href: '#experience' },
  { text: 'Skills', icon: <ConstructionIcon />, href: '#skills' },
  { text: 'Contact', icon: <EmailIcon />, href: '#contact' },
];

export default function Header({ name }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (href) => {
    setMobileOpen(false);
    
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const drawer = (
    <Box 
      sx={{ 
        width: 320, 
        height: '100%',
        background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.98) 0%, rgba(15, 30, 50, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient blob */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          pb: 3,
          borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Navigation
          </Typography>
          <IconButton 
            onClick={handleDrawerToggle} 
            aria-label="close navigation"
            component={motion.button}
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.2 }}
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(0, 217, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation List */}
        <List sx={{ p: 0 }}>
          {navItems.map((item, index) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ mb: 1.5 }}
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItemButton
                onClick={() => handleNavClick(item.href)}
                component={motion.div}
                whileHover={{ x: 8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  background: 'rgba(0, 217, 255, 0.03)',
                  border: '1px solid rgba(0, 217, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 255, 136, 0.15) 100%)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 217, 255, 0.2)',
                    '& .nav-icon': {
                      background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transform: 'scale(1.1)',
                    },
                    '& .nav-text': {
                      background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  className="nav-icon"
                  sx={{ 
                    color: 'primary.main',
                    minWidth: 40,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  className="nav-text"
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Bottom decoration */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(0, 217, 255, 0.1)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          >
            Navigate through sections
          </Typography>
        </Box>
      </Box>
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
            width: 320,
            backgroundColor: 'transparent',
            border: 'none',
            overflowY: 'auto',
          },
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
}
