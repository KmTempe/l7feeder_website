import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Button, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';

const navItems = [
    { text: 'Home', icon: <HomeIcon />, href: '#home' },
    { text: 'About', icon: <PersonIcon />, href: '#about' },
    { text: 'Experience', icon: <WorkIcon />, href: '#experience' },
    { text: 'Skills', icon: <ConstructionIcon />, href: '#skills' },
    { text: 'Contact', icon: <EmailIcon />, href: '#contact' },
];

const socialLinks = [
    { icon: <GitHubIcon />, href: 'https://github.com/KmTempe', label: 'GitHub' },
    { icon: <InstagramIcon />, href: 'https://www.instagram.com/rememberthe5thofnovember1605/', label: 'Instagram' },
];

export default function SidePanel({ name }) {
    const handleNavClick = (href) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Box
            sx={{
                width: 300,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#0a192f', // Theme default background
                borderRight: '1px solid rgba(100, 255, 218, 0.1)',
                p: 4,
                zIndex: 1200,
            }}
        >
            <Box>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontFamily: '"Fira Code", monospace' }}>
                        Full Stack Developer
                    </Typography>
                </Box>

                <List sx={{ width: '100%' }}>
                    {navItems.map((item, index) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavClick(item.href)}
                                component={motion.div}
                                whileHover={{ x: 5 }}
                                sx={{
                                    borderRadius: 1,
                                    '&:hover': {
                                        background: 'rgba(100, 255, 218, 0.1)',
                                        '& .nav-icon': { color: 'primary.main' },
                                        '& .nav-text': { color: 'primary.main' },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    className="nav-icon"
                                    sx={{
                                        color: 'text.secondary',
                                        minWidth: 40,
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    className="nav-text"
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        transition: 'color 0.3s ease',
                                        fontSize: '0.95rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                    {socialLinks.map((link) => (
                        <IconButton
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {link.icon}
                        </IconButton>
                    ))}
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    href="/cv.pdf"
                    target="_blank"
                    sx={{
                        py: 1.5,
                        fontFamily: '"Fira Code", monospace',
                    }}
                >
                    Resume
                </Button>
            </Box>
        </Box>
    );
}
