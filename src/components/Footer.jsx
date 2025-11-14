import { useState } from 'react';
import { Box, Container, Typography, Link, IconButton, Paper } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import DiscordIcon from './icons/DiscordIcon';
import { portfolioData } from '../data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [discordPopupOpen, setDiscordPopupOpen] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        borderTop: '1px solid rgba(0, 217, 255, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {portfolioData.name}. Engineered with precision & curiosity.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component={Link}
                href="https://github.com/KmTempe"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.instagram.com/rememberthe5thofnovember1605/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => setDiscordPopupOpen(!discordPopupOpen)}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <DiscordIcon fontSize="small" />
                </IconButton>
                {discordPopupOpen && (
                  <Paper
                    elevation={8}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      mt: 1,
                      px: 2,
                      py: 1.5,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      animation: 'popupSlide 0.3s ease-out',
                      '@keyframes popupSlide': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateX(-50%) translateY(-10px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateX(-50%) translateY(0)',
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid rgba(0, 255, 136, 0.3)',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <DiscordIcon sx={{ fontSize: 18 }} />
                      vannesss
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            Built with{' '}
            <Link
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              React
            </Link>
            ,{' '}
            <Link
              href="https://vitejs.dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              Vite
            </Link>
            , and{' '}
            <Link
              href="https://mui.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              Material Design 3
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
