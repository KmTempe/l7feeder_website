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
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '"01."',
                    color: 'primary.main',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '1.5rem',
                    mr: 2,
                    fontWeight: 400,
                  },
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '300px',
                    height: '1px',
                    bgcolor: 'rgba(136, 146, 176, 0.2)',
                    ml: 3,
                    display: { xs: 'none', sm: 'block' },
                  },
                }}
              >
                About Me
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '3fr 2fr' }, gap: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {about.description.map((paragraph, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {paragraph}
                </Typography>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: '300px',
                  mx: 'auto',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    width: '100%',
                    height: '100%',
                    border: '2px solid #64ffda',
                    borderRadius: 2,
                    zIndex: -1,
                    transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                  },
                  '&:hover::after': {
                    top: 15,
                    left: 15,
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#64ffda',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover img': {
                      filter: 'none',
                      mixBlendMode: 'normal',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://github.com/KmTempe.png" // Using GitHub avatar as placeholder
                    alt="Profile"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      filter: 'grayscale(100%) contrast(1)',
                      mixBlendMode: 'multiply',
                      transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                      opacity: 0.9,
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
