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
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

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
        justifyContent: 'flex-start',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div style={{ opacity, y }}>
          <Box sx={{ maxWidth: '800px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'primary.main',
                  fontFamily: '"Fira Code", monospace',
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Hi, my name is
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                {name}.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                I build things for the web.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 6,
                  maxWidth: '540px',
                  fontSize: '1.1rem',
                }}
              >
                {tagline}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleScroll('#experience')}
                sx={{
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  padding: '1.25rem 1.75rem',
                  fontSize: '0.9rem',
                  fontFamily: '"Fira Code", monospace',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Check out my work!
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
