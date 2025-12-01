import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Button, Avatar, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import DownloadIcon from '@mui/icons-material/Download';
import DiscordIcon from './icons/DiscordIcon';
import { motion } from 'framer-motion';

const navItems = [
    { text: 'Home', icon: <HomeIcon />, href: '#home' },
    { text: 'About', icon: <PersonIcon />, href: '#about' },
    { text: 'Experience', icon: <WorkIcon />, href: '#experience' },
    { text: 'Education', icon: <SchoolIcon />, href: '#education' },
    { text: 'Skills', icon: <ConstructionIcon />, href: '#skills' },
    { text: 'Contact', icon: <EmailIcon />, href: '#contact' },
];

const socialLinks = [
    { icon: <GitHubIcon />, href: 'https://github.com/KmTempe', label: 'GitHub' },
    { icon: <InstagramIcon />, href: 'https://www.instagram.com/rememberthe5thofnovember1605/', label: 'Instagram' },
];

export default function SidePanel({ name }) {
    const [discordPopupOpen, setDiscordPopupOpen] = useState(false);
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
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                        <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography
                            component="a"
                            href="mailto:kosmas.temperekidis@live.com"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                fontFamily: '"Fira Code", monospace',
                                fontSize: '0.8rem',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'primary.main' },
                            }}
                        >
                            kosmas.temperekidis@live.com
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: '"Fira Code", monospace', fontSize: '0.8rem' }}>
                        Connect with me
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {socialLinks.map((link) => (
                            <IconButton
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: 'text.secondary',
                                    border: '1px solid rgba(100, 255, 218, 0.1)',
                                    '&:hover': {
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {link.icon}
                            </IconButton>
                        ))}
                        <Box sx={{ position: 'relative' }}>
                            <IconButton
                                onClick={() => setDiscordPopupOpen(!discordPopupOpen)}
                                sx={{
                                    color: 'text.secondary',
                                    border: '1px solid rgba(100, 255, 218, 0.1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <DiscordIcon />
                            </IconButton>
                            {discordPopupOpen && (
                                <Paper
                                    elevation={8}
                                    sx={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        mb: 1,
                                        px: 2,
                                        py: 1.5,
                                        bgcolor: '#112240',
                                        border: '1px solid rgba(100, 255, 218, 0.3)',
                                        borderRadius: 1,
                                        whiteSpace: 'nowrap',
                                        animation: 'popupSlide 0.3s ease-out',
                                        '@keyframes popupSlide': {
                                            '0%': {
                                                opacity: 0,
                                                transform: 'translateX(-50%) translateY(10px)',
                                            },
                                            '100%': {
                                                opacity: 1,
                                                transform: 'translateX(-50%) translateY(0)',
                                            },
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -6,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 0,
                                            borderLeft: '6px solid transparent',
                                            borderRight: '6px solid transparent',
                                            borderTop: '6px solid rgba(100, 255, 218, 0.3)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            fontFamily: '"Fira Code", monospace',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        <DiscordIcon sx={{ fontSize: 16 }} />
                                        vannesss
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </Box>
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
