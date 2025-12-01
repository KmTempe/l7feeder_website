import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import DiscordIcon from './icons/DiscordIcon';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';



export default function Contact({ email }) {
  // Use dynamic base path for API requests
  const apiUrl = import.meta.env.DEV
    ? `${window.location.origin.replace(/:5173$/, ':3000')}/api/contact`
    : '/api/contact';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [discordPopupOpen, setDiscordPopupOpen] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSnackbar({
        open: true,
        message: 'All fields are required.',
        severity: 'error',
      });
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Please provide a valid email address.',
        severity: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: 'Message sent! Expect a follow-up soon.',
          severity: 'success',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Unable to send the message right now. Please try later.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Unable to send the message right now. Please try later.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 12, md: 20 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box ref={ref} sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontFamily: '"Fira Code", monospace',
                fontSize: '1rem',
                mb: 2,
                display: 'block',
              }}
            >
              04. What's Next?
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Get In Touch
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                mb: 6,
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              I'm currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: '#112240',
                borderRadius: 2,
                textAlign: 'left',
                maxWidth: '600px',
                mx: 'auto',
                boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>Name</Typography>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={64}
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      border: '1px solid rgba(136, 146, 176, 0.2)',
                      background: 'rgba(2, 12, 27, 0.7)',
                      color: '#ccd6f6',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>Email</Typography>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={128}
                    placeholder="Your email"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      border: '1px solid rgba(136, 146, 176, 0.2)',
                      background: 'rgba(2, 12, 27, 0.7)',
                      color: '#ccd6f6',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>Message</Typography>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    placeholder="How can I help?"
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      border: '1px solid rgba(136, 146, 176, 0.2)',
                      background: 'rgba(2, 12, 27, 0.7)',
                      color: '#ccd6f6',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    fontFamily: '"Fira Code", monospace',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 255, 218, 0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Paper>
          </motion.div>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, px: { xs: 2, sm: 0 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: 'rgba(17, 34, 64, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 }, mb: 3, flexWrap: 'wrap' }}>
                <EmailIcon sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
                <Link
                  href={`mailto:${email}`}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontFamily: '"Fira Code", monospace',
                    transition: 'color 0.3s ease',
                    wordBreak: 'break-all',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {email}
                </Link>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: '"Fira Code", monospace', fontSize: '0.85rem' }}>
                Connect with me
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <IconButton
                  component={Link}
                  href="https://github.com/KmTempe/portfolio-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(100, 255, 218, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
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
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(100, 255, 218, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={() => setDiscordPopupOpen(!discordPopupOpen)}
                    sx={{
                      color: 'text.secondary',
                      border: '1px solid rgba(100, 255, 218, 0.1)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
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
                        bgcolor: '#112240',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        borderRadius: 1,
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
                          top: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderBottom: '6px solid rgba(100, 255, 218, 0.3)',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontFamily: '"Fira Code", monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        <DiscordIcon sx={{ fontSize: 16 }} />
                        vannesss
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
