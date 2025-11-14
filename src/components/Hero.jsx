import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

export default function Hero({ name, title, tagline }) {
  const handleScroll = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            py: 3,
            position: 'relative',
            zIndex: 1,
            mt: { xs: -8, md: -12 },
          }}
        >
          <Chip
            label="👋 Available for Opportunities"
            sx={{ 
              mb: 3,
              background: 'rgba(0, 217, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              color: '#00d9ff',
              fontSize: '0.9rem',
              padding: '0.5rem',
            }}
          />
          
          <Typography 
            variant="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {name}
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ 
              mb: 5,
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {tagline}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleScroll('#experience')}
            >
              Explore My Work
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleScroll('#contact')}
            >
              Let's Connect
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Scroll indicator */}
      <Box
        onClick={() => handleScroll('#about')}
        sx={{
          position: 'absolute',
          bottom: { xs: 40, md: 60 },
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          animation: 'bounce 2s infinite',
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1,
          },
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '40%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
            '60%': {
              transform: 'translateX(-50%) translateY(-5px)',
            },
          },
        }}
      >
        <KeyboardArrowDown sx={{ fontSize: 40, color: '#00d9ff', opacity: 0.6 }} />
      </Box>
    </Box>
  );
}
