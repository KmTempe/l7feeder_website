import { Box, Container, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home({ name, about }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

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
        pt: { xs: 10, xl: 0 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div style={{ opacity, y }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1.2fr 0.8fr' }, gap: { xs: 4, lg: 6 }, alignItems: 'center' }}>
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
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
              </ motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {name}.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                  }}
                >
                  I build things. Only God knows if they work.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box sx={{ mb: 4, maxWidth: '540px' }}>
                  {about.description.map((paragraph, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        fontSize: '1.1rem',
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
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
              </motion.div>
            </Box>

            {/* Desktop Image */}
            <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      maxWidth: { xs: '280px', xl: '350px' },
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
                        src="https://github.com/KmTempe.png"
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
              </motion.div>
            </Box>
          </Box >
        </motion.div >
      </Container >
    </Box >
  );
}
