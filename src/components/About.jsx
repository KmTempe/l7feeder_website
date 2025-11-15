import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About({ about }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Box ref={ref} sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
              }}
            >
              ABOUT
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography 
              variant="h3" 
              sx={{
                mt: 1,
                mb: 3,
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              Engineering with Purpose
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontSize: '1rem', 
                lineHeight: 1.8,
                maxWidth: '700px',
              }}
            >
              {about.description}
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
