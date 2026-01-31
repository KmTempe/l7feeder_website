import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      component="section"
      id="experience"
      sx={{
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box ref={ref} sx={{ mb: 4, textAlign: 'left' }}>
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
                    content: '"02."',
                    color: 'primary.main',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '1.5rem',
                    mr: 2,
                    fontWeight: 400,
                  },
                  '&::after': {
                    content: '""',
                    width: '300px',
                    height: '1px',
                    bgcolor: 'rgba(136, 146, 176, 0.2)',
                    ml: 3,
                    display: { xs: 'none', sm: 'block' },
                  },
                }}
              >
                Where I&apos;ve Worked
              </Typography>
            </Box >
          </motion.div >
        </Box >

        <Box sx={{ position: 'relative', pl: { xs: 2, md: 0 } }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {experience.map((exp) => (
              <motion.div
                key={exp.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box
                  sx={{
                    mb: 4,
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr 3fr' },
                    gap: { xs: 1, md: 4 },
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: '"Fira Code", monospace',
                      fontSize: '0.85rem',
                      pt: 0.5,
                    }}
                  >
                    {exp.period}
                  </Typography>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '1.25rem',
                        mb: 0.5,
                      }}
                    >
                      {exp.title} <Box component="span" sx={{ color: 'primary.main' }}>@ {exp.company || exp.institution}</Box>
                    </Typography>

                    {exp.responsibilities && (
                      <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', mt: 2 }}>
                        {exp.responsibilities.map((resp, idx) => (
                          <Box
                            key={idx}
                            component="li"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '1rem',
                              mb: 1.5,
                              position: 'relative',
                              pl: '20px',
                              transition: 'all 0.2s ease',
                              '&::before': {
                                content: '"▹"',
                                position: 'absolute',
                                left: 0,
                                color: 'primary.main',
                                transition: 'all 0.2s ease',
                              },
                              '&:hover': {
                                color: 'text.primary',
                              },
                              '&:hover::before': {
                                textShadow: '0 0 10px rgba(100, 255, 218, 0.8), 0 0 20px rgba(100, 255, 218, 0.4)',
                                transform: 'scale(1.2)',
                              },
                            }}
                          >
                            {resp}
                          </Box>
                        ))}
                      </Box>
                    )}
                    {exp.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '1rem',
                          mt: 2,
                        }}
                      >
                        {exp.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Container >
    </Box >
  );
}
