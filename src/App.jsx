import { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import AnimatedBlobs from './components/AnimatedBlobs';

// Lazy load components that are below the fold
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollProgress />
      <AnimatedBlobs />
      <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Header name={portfolioData.name} />
        <Hero
          name={portfolioData.name}
          title={portfolioData.title}
          tagline={portfolioData.tagline}
        />
        <Suspense fallback={<Box sx={{ minHeight: '50vh' }} />}>
          <About about={portfolioData.about} />
          <Experience experience={portfolioData.experience} />
          <Skills skills={portfolioData.skills} />
          <Contact
            email={portfolioData.email}
            phone={portfolioData.phone}
          />
          <Footer />
        </Suspense>
        <SpeedInsights />
      </Box>
    </ThemeProvider>
  );
}

export default App;
