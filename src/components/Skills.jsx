import { Box, Container, Typography, Chip } from '@mui/material';

export default function Skills({ skills }) {
  return (
    <Box
      component="section"
      id="skills"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #0a1628 0%, #0f1f35 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
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
        </Box>

        {Object.entries(skills).map(([category, items], index) => (
          <Box key={category} sx={{ mb: 4 }}>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {items.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0, 217, 255, 0.08)',
                    color: 'text.secondary',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    '&:hover': {
                      bgcolor: 'rgba(0, 217, 255, 0.15)',
                      borderColor: 'rgba(0, 217, 255, 0.4)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
