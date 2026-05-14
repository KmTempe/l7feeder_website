import { Box, Container, Typography, Chip } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import VideoModal from './VideoModal';

const STRESS_VIDEO_URL = import.meta.env.VITE_STRESS_VIDEO_URL || '';

const SPECIAL_SKILL = 'Working in High Stress Environments';

/** Keyframe animation for the pulse-glow effect */
const pulseGlowKeyframes = {
  '@keyframes pulseGlow': {
    '0%': {
      boxShadow: '0 0 4px rgba(100, 255, 218, 0.3), 0 0 8px rgba(100, 255, 218, 0.15)',
    },
    '50%': {
      boxShadow: '0 0 10px rgba(100, 255, 218, 0.6), 0 0 20px rgba(100, 255, 218, 0.3), 0 0 30px rgba(100, 255, 218, 0.15)',
    },
    '100%': {
      boxShadow: '0 0 4px rgba(100, 255, 218, 0.3), 0 0 8px rgba(100, 255, 218, 0.15)',
    },
  },
};

/** Returns onClick handler for interactive skill chips */
function getSkillClickHandler(category, skill, openVideoModal) {
  if (skill === SPECIAL_SKILL) return openVideoModal;
  if (category === 'Tools & Platforms' && skill === 'Git') {
    return () => window.open('https://github.com/KmTempe/portfolio-react', '_blank');
  }
  if (category === 'Frameworks' && skill === 'Next.js') {
    return () => window.open('https://binlookup.l7feeders.dev/', '_blank');
  }
  return undefined;
}

export default function Skills({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!skills || Object.keys(skills).length === 0) return null;

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

  return (
    <Box
      component="section"
      id="skills"
      sx={{
        py: { xs: 6, md: 10 },
        ...pulseGlowKeyframes,
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
                    content: '"05."',
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
                Expertise
              </Typography>
            </Box >
          </motion.div >
        </Box >

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {Object.entries(skills).map(([category, items]) => (
              <motion.div key={category} variants={itemVariants}>
                <Box
                  sx={{
                    bgcolor: '#112240',
                    p: 4,
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 3,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '"▹"',
                        color: 'primary.main',
                        mr: 1,
                        fontSize: '1.2rem',
                      }
                    }}
                  >
                    {category}
                  </Typography>
                  <Box
                    component={motion.div}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}
                  >
                    {items.map((skill, idx) => {
                      const isSpecial = skill === SPECIAL_SKILL;
                      return (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip
                            label={skill}
                            onClick={getSkillClickHandler(
                              category,
                              skill,
                              () => setIsVideoOpen(true),
                            )}
                            sx={{
                              bgcolor: isSpecial
                                ? 'rgba(100, 255, 218, 0.18)'
                                : 'rgba(100, 255, 218, 0.1)',
                              color: 'primary.main',
                              fontFamily: '"Fira Code", monospace',
                              fontSize: '0.8rem',
                              borderRadius: 1,
                              height: '28px',
                              cursor: isSpecial ? 'pointer' : 'default',
                              border: isSpecial
                                ? '1px solid rgba(100, 255, 218, 0.4)'
                                : 'none',
                              animation: isSpecial
                                ? 'pulseGlow 2.5s ease-in-out infinite'
                                : 'none',
                              '&:hover': {
                                bgcolor: isSpecial
                                  ? 'rgba(100, 255, 218, 0.3)'
                                  : 'rgba(100, 255, 218, 0.2)',
                              },
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div >

        {/* Video modal for the stress skill */}
        <VideoModal
          open={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={STRESS_VIDEO_URL}
          title="Working in High Stress Environments"
        />
      </Container >
    </Box >
  );
}
