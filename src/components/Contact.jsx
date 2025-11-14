import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  // TextField,
  // Button,
  // Grid,
  Paper,
  Link,
  // Snackbar,
  // Alert,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import DiscordIcon from './icons/DiscordIcon';

export default function Contact({ email, phone }) {
  /* COMMENTED OUT FOR STATIC GITHUB PAGES DEPLOYMENT - UNCOMMENT WHEN ADDING BACKEND */
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: '',
  // });
  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: '',
  //   severity: 'success',
  // });
  const [discordPopupOpen, setDiscordPopupOpen] = useState(false);

  /* COMMENTED OUT FOR STATIC GITHUB PAGES DEPLOYMENT - UNCOMMENT WHEN ADDING BACKEND */
  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
  //     setSnackbar({
  //       open: true,
  //       message: 'All fields are required.',
  //       severity: 'error',
  //     });
  //     return;
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(formData.email)) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Please provide a valid email address.',
  //       severity: 'error',
  //     });
  //     return;
  //   }

  //   try {
  //     console.log('Form submitted:', formData);
      
  //     setSnackbar({
  //       open: true,
  //       message: 'Message received! Expect a follow-up soon.',
  //       severity: 'success',
  //     });

  //     setFormData({ name: '', email: '', message: '' });
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Unable to send the message right now. Please try later.',
  //       severity: 'error',
  //     });
  //   }
  // };

  // const handleCloseSnackbar = () => {
  //   setSnackbar({ ...snackbar, open: false });
  // };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.15em',
              mb: 1,
              display: 'block',
              fontSize: '0.85rem',
            }}
          >
            LET'S COLLABORATE
          </Typography>
          <Typography 
            variant="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Get In Touch
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
            Interested in collaboration or have a question? Feel free to reach out via email or connect with me on social media.
          </Typography>
        </Box>

        {/* COMMENTED OUT CONTACT FORM FOR STATIC GITHUB PAGES DEPLOYMENT - UNCOMMENT WHEN ADDING BACKEND */}
        {/* <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={0}
              sx={{
                p: 5,
                backgroundColor: 'rgba(15, 31, 53, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(0, 217, 255, 0.4)',
                },
              }}
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="How can I help?"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                multiline
                rows={6}
                margin="normal"
                variant="outlined"
                inputProps={{ maxLength: 1000 }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Send Message
              </Button>
            </Paper>
          </Grid>
        </Grid> */}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, px: { xs: 2, sm: 0 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              backgroundColor: 'rgba(15, 31, 53, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 }, mb: 3, flexWrap: 'wrap' }}>
              <EmailIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
              <Link
                href={`mailto:${email}`}
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  transition: 'color 0.3s ease',
                  wordBreak: 'break-all',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {email}
              </Link>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Connect with me
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
              <IconButton
                component={Link}
                href="https://github.com/KmTempe/portfolio-react"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(0, 217, 255, 0.08)',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.instagram.com/rememberthe5thofnovember1605/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(0, 217, 255, 0.08)',
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => setDiscordPopupOpen(!discordPopupOpen)}
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'secondary.main',
                      borderColor: 'secondary.main',
                      bgcolor: 'rgba(0, 255, 136, 0.08)',
                    },
                  }}
                >
                  <DiscordIcon />
                </IconButton>
                {discordPopupOpen && (
                  <Paper
                    elevation={8}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      mt: 1,
                      px: 2,
                      py: 1.5,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      animation: 'popupSlide 0.3s ease-out',
                      '@keyframes popupSlide': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateX(-50%) translateY(-10px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateX(-50%) translateY(0)',
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid rgba(0, 255, 136, 0.3)',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <DiscordIcon sx={{ fontSize: 18 }} />
                      vannesss
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* COMMENTED OUT SNACKBAR FOR STATIC GITHUB PAGES DEPLOYMENT - UNCOMMENT WHEN ADDING BACKEND */}
      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 6000 : 4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar> */}
    </Box>
  );
}
