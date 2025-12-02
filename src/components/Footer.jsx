import { Box, Container, Typography, Link } from '@mui/material';
import { portfolioData } from '../data/portfolioData';
import packageJson from '../../package.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        borderTop: '1px solid rgba(0, 217, 255, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {portfolioData.name}. Engineered with curiosity & only god knows what i have do &nbsp;
              <span style={{ fontSize: '0.85em', color: '#9db4cc', }}>Version&nbsp;{packageJson.version}</span>
            </Typography>

          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            Built with{' '}
            <Link
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              React
            </Link>
            ,{' '}
            <Link
              href="https://vitejs.dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              Vite
            </Link>
            , and{' '}
            <Link
              href="https://mui.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              Material Design 3
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
