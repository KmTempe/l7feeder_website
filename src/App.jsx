import { useState, lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import Home from './components/Home';
import ScrollProgress from './components/ScrollProgress';
import AnimatedBlobs from './components/AnimatedBlobs';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import SidePanel from './components/SidePanel';


// Lazy load components that are below the fold
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const Education = lazy(() => import('./components/Education'));

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollProgress />
      {/* <AnimatedBlobs /> */}
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header name={portfolioData.name} onDrawerToggle={handleDrawerToggle} />
        <SidePanel name={portfolioData.name} mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1,
            ml: { xl: '300px' }, // Add margin left on desktop to account for SidePanel
            width: { xl: `calc(100% - 300px)` },
            pr: { xl: '300px' } // Add padding right to balance the SidePanel and center content in viewport
          }}
        >
          <Home
            name={portfolioData.name}
            title={portfolioData.title}
            about={portfolioData.about}
          />
          <Suspense fallback={<Box sx={{ minHeight: '50vh' }} />}>
            <Experience experience={portfolioData.experience} />
            <Projects projects={portfolioData.projects} />
            <Education education={portfolioData.education} />
            <Skills skills={portfolioData.skills} />
            <Contact
              email={portfolioData.email}
            />
            <Footer />
          </Suspense>
          <SpeedInsights />
          <Analytics />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
