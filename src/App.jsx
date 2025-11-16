import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import Home from './components/Home';
import ScrollProgress from './components/ScrollProgress';
import AnimatedBlobs from './components/AnimatedBlobs';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';



// Lazy load components that are below the fold
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollProgress />
      <AnimatedBlobs />
      <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Header name={portfolioData.name} />
        <Home
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
        <Analytics />
      </Box>
    </ThemeProvider>
  );
}

export default App;
