import { Box, Container, Typography, Chip } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Skills({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box
      component="section"
      id="skills"
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
              EXPERTISE
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
                mb: 4,
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              Technical Skills
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div key={category} variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  {category}
                </Typography>
                <motion.div
                  variants={containerVariants}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                >
                  {items.map((skill, idx) => (
                    <motion.div key={idx} variants={chipVariants}>
                      <Chip
                        label={skill}
                        size="small"
                        component={motion.div}
                        whileHover={{ scale: 1.05, y: -2 }}
                        sx={{
                          bgcolor: 'rgba(0, 217, 255, 0.08)',
                          color: 'text.secondary',
                          border: '1px solid rgba(0, 217, 255, 0.2)',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          transition: 'all 0.3s ease-out',
                          '&:hover': {
                            bgcolor: 'rgba(0, 217, 255, 0.15)',
                            borderColor: 'rgba(0, 217, 255, 0.4)',
                            background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
                            color: '#0a1628',
                            fontWeight: 600,
                            boxShadow: '0 0 0 4px rgba(0, 217, 255, 0.2), 0 0 20px rgba(0, 217, 255, 0.6)',
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}
