import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home({ name, tagline }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const handleScroll = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      ref={ref}
      component="section"
      id="home"
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
        <motion.div
          style={{ opacity, scale, y }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              position: 'relative',
              zIndex: 1,
              mt: { xs: -8, md: -12 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Chip
                label="👋 Available for Opportunities"
                sx={{ 
                  mb: 3,
                  background: 'rgba(0, 217, 255, 0.15)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#00d9ff',
                  fontSize: '0.9rem',
                  padding: '0.5rem',
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
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
            </motion.div>
          </Box>
        </motion.div>
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
