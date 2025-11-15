import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Experience({ experience }) {
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
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <Box
      component="section"
      id="experience"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Box ref={ref} sx={{ mb: 6, textAlign: 'left' }}>
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
              JOURNEY
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
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              Career & Education
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ position: 'relative', pl: { xs: 2.5, sm: 3, md: 5 } }}>
          {/* Vertical line */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 4, sm: 5, md: 13 },
              top: 8,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, rgba(0, 217, 255, 0.4) 0%, rgba(0, 217, 255, 0.05) 100%)',
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Box
                  className="experience-item"
                  component={motion.div}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    position: 'relative',
                    mb: 5,
                    '&:last-child': { mb: 0 },
                    '&:hover .timeline-dot': {
                      background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
                      boxShadow: '0 0 0 4px rgba(0, 217, 255, 0.2), 0 0 20px rgba(0, 217, 255, 0.6)',
                      transform: 'scale(1.3)',
                    },
                  }}
                >
                  {/* Timeline dot */}
                  <Box
                    className="timeline-dot"
                    component={motion.div}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                    sx={{
                      position: 'absolute',
                      left: { xs: -10, sm: -12, md: -20 },
                      top: 4,
                      width: { xs: 8, sm: 10 },
                      height: { xs: 8, sm: 10 },
                      borderRadius: '50%',
                      background: 'rgba(0, 217, 255, 0.5)',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease-out',
                      willChange: 'transform, background, box-shadow',
                    }}
                  />

                  <Box sx={{ pl: { xs: 1.5, sm: 2, md: 3 } }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      {exp.period}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'secondary.main',
                        mb: 0.25,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      {exp.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        mb: exp.responsibilities ? 1.5 : 0,
                      }}
                    >
                      {exp.company || exp.institution}
                    </Typography>
                    {exp.responsibilities && (
                      <Box component="ul" sx={{ m: 0, pl: 2, listStyle: 'none' }}>
                        {exp.responsibilities.map((resp, idx) => (
                          <Typography
                            key={idx}
                            component="li"
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.85rem',
                              mb: 0.5,
                              position: 'relative',
                              pl: 2,
                              '&::before': {
                                content: '"•"',
                                position: 'absolute',
                                left: 0,
                                color: 'primary.main',
                              },
                            }}
                          >
                            {resp}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {exp.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.85rem',
                          mt: 1,
                          fontStyle: 'italic',
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
      </Container>
    </Box>
  );
}
