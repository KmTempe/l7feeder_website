import { useState, lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
//import useMediaQuery from '@mui/material/useMediaQuery';
import { theme } from './theme/theme';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import Home from './components/Home';
import ScrollProgress from './components/ScrollProgress';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
//import Snowfall from 'react-snowfall';

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
  // const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  //const snowflakeCount = prefersReducedMotion ? 0 : isMobile ? 35 : isTablet ? 60 : 90;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* {!prefersReducedMotion && (
        <Snowfall
          snowflakeCount={snowflakeCount}
          speed={isMobile ? [0.6, 1.4] : [0.8, 2.0]}
          wind={isMobile ? [-0.2, 0.8] : [-0.5, 1.2]}
          radius={isMobile ? [0.5, 2.2] : [0.5, 3.0]}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )} */}
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
