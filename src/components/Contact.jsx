import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
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
    } catch {
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
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box ref={ref} sx={{ mb: 6 }}>
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
              05. What&apos;s Next?
            </Typography>
          </motion.div >

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
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              I&apos;m currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
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


        </Box >
      </Container >

      {/* Snackbar for feedback */}
      < Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }
        }
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar >
    </Box >
  );
}
