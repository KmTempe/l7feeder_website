import { Fragment } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { portfolioData as defaultPortfolioData } from '../data/portfolioData';
import packageJson from '../../package.json';

export default function Footer({ portfolioData = defaultPortfolioData }) {
  const currentYear = new Date().getFullYear();
  const site = portfolioData.site || {};
  const profile = portfolioData.profile || {};
  const builtWith = site.builtWith || [];

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
              &copy; {currentYear} {profile.name}. {site.footerNote}{' '}
              {site.showVersion && (
                <span style={{ fontSize: '0.85em', color: '#9db4cc' }}>
                  Version&nbsp;{packageJson.version}
                </span>
              )}
            </Typography>

          </Box>
          {builtWith.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              Built with{' '}
              {builtWith.map((technology, index) => (
                <Fragment key={technology.label}>
                  {index > 0 && (index === builtWith.length - 1 ? ' and ' : ', ')}
                  <Link
                    href={technology.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { color: 'secondary.main' },
                    }}
                  >
                    {technology.label}
                  </Link>
                </Fragment>
              ))}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
