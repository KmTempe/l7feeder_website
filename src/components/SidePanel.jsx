import { useState, useMemo } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import ResumeDocument from './ResumeDocument';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import DiscordIcon from './icons/DiscordIcon';
import { motion } from 'framer-motion';
import { hasContentForSection } from '../data/portfolioHelpers';

import { Drawer } from '@mui/material';

const navIcons = {
    home: <HomeIcon />,
    experience: <WorkIcon />,
    projects: <CodeIcon />,
    education: <SchoolIcon />,
    skills: <ConstructionIcon />,
    contact: <EmailIcon />,
};

const socialIcons = {
    github: <GitHubIcon />,
    instagram: <InstagramIcon />,
    discord: <DiscordIcon />,
};

export default function SidePanel({ mobileOpen, onClose, portfolioData }) {
    const [discordPopupOpen, setDiscordPopupOpen] = useState(false);
    const profile = portfolioData.profile;
    const contact = portfolioData.contact;
    const resume = portfolioData.resume || {};

    const navItems = useMemo(() => {
        return (portfolioData?.sections || [])
            .filter((section) => hasContentForSection(portfolioData, section.id))
            .map((section) => ({
                text: section.navLabel || section.title,
                icon: navIcons[section.id],
                href: `#${section.id}`,
            }));
    }, [portfolioData]);
    const handleNavClick = (href) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (onClose) onClose();
        }
    };

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#0a192f',
                p: 4,
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
                        {profile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace', mb: 2 }}>
                        {profile.title}
                    </Typography>

                    {/* Mobile/Tablet Profile Image */}
                    <Box
                        sx={{
                            display: { xs: 'block', xl: 'none' },
                            mb: 4,
                            position: 'relative',
                            width: '150px',
                            mx: 'auto',
                        }}
                    >
                        <Box
                            component="img"
                            src={profile.image?.src}
                            alt={profile.image?.alt}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '50%',
                                border: '2px solid #64ffda',
                                filter: 'grayscale(100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    filter: 'none',
                                }
                            }}
                        />
                    </Box>
                </Box>

                <List sx={{ width: '100%' }}>
                    {navItems.map((item) => (
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
                            href={`mailto:${contact.email}`}
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                fontFamily: '"Fira Code", monospace',
                                fontSize: '0.8rem',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'primary.main' },
                            }}
                        >
                            {contact.email}
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: '"Fira Code", monospace', fontSize: '0.8rem' }}>
                        Connect with me
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {portfolioData.socials.map((link) => (
                            link.href ? (
                                <IconButton
                                    key={link.label}
                                    href={link.href}
                                    aria-label={link.label}
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
                                    {socialIcons[link.type]}
                                </IconButton>
                            ) : (
                                <Box key={link.label} sx={{ position: 'relative' }}>
                                    <IconButton
                                        aria-label={link.label}
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
                                        {socialIcons[link.type]}
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
                                                {socialIcons[link.type]}
                                                {link.handle}
                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>
                            )
                        ))}
                    </Box>
                </Box>

                <BlobProvider document={<ResumeDocument />}>
                    {({ url, loading }) => (
                        <Button
                            component="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            fullWidth
                            startIcon={<DownloadIcon />}
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                fontFamily: '"Fira Code", monospace',
                            }}
                        >
                            {loading ? resume.loadingLabel : resume.buttonLabel}
                        </Button>
                    )}
                </BlobProvider>
            </Box>
        </Box >
    );

    return (
        <Box
            component="nav"
            sx={{ width: { xl: 300 }, flexShrink: { xl: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', xl: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 300,
                        borderRight: '1px solid rgba(100, 255, 218, 0.1)',
                        background: '#0a192f',
                        backgroundImage: 'none'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Permanent Drawer */}
            <Box
                sx={{
                    display: { xs: 'none', xl: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                    width: 300,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    borderRight: '1px solid rgba(100, 255, 218, 0.1)',
                }}
            >
                {drawerContent}
            </Box>
        </Box>
    );
}
