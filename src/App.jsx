import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Morphing Background Blobs */}
      <div className="blob-1" />
      <div className="blob-2" />
      <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Header name={portfolioData.name} />
        <Hero
          name={portfolioData.name}
          title={portfolioData.title}
          tagline={portfolioData.tagline}
        />
        <About about={portfolioData.about} />
        <Experience experience={portfolioData.experience} />
        <Skills skills={portfolioData.skills} />
        <Contact
          email={portfolioData.email}
          phone={portfolioData.phone}
        />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
