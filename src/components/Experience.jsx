import { Box, Container, Typography } from '@mui/material';

export default function Experience({ experience }) {
  return (
    <Box
      component="section"
      id="experience"
      sx={{
        py: { xs: 8, md: 12 },
        background: '#0a1628',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'left' }}>
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

          {experience.map((exp, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                mb: 5,
                '&:last-child': { mb: 0 },
              }}
            >
              {/* Timeline dot */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: -10, sm: -12, md: -20 },
                  top: 4,
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: '50%',
                  background: index === 0 ? 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)' : 'rgba(0, 217, 255, 0.5)',
                  boxShadow: index === 0 ? '0 0 0 4px rgba(0, 217, 255, 0.2)' : 'none',
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
          ))}
        </Box>
      </Container>
    </Box>
  );
}
