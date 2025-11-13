import { Box, Container, Typography } from '@mui/material';

export default function About({ about }) {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #0f1f35 0%, #0a1628 100%)',
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
            ABOUT
          </Typography>
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
        </Box>
      </Container>
    </Box>
  );
}
