import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Shared input styles
const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid rgba(136, 146, 176, 0.2)',
  background: 'rgba(2, 12, 27, 0.7)',
  color: '#ccd6f6',
  fontSize: '1rem',
  outline: 'none',
  fontFamily: 'inherit',
};

// Steps: 'form' → 'otp' → 'done'
const OTP_DURATION = 5 * 60; // 5 minutes in seconds

export default function Contact() {
  const sendOtpUrl = '/api/send-otp';
  const verifyOtpUrl = '/api/verify-otp';

  // ── State ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState('form');           // 'form' | 'otp' | 'done'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [countdown, setCountdown] = useState(0);       // seconds remaining for OTP
  const [resendCooldown, setResendCooldown] = useState(0); // seconds before user can resend

  const ref = useRef(null);
  const otpInputRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // ── Countdown timer for OTP expiry ───────────────────────────────────────
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSnackbar({ open: true, message: 'Verification code expired. Please request a new one.', severity: 'warning' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // ── Resend cooldown timer ────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus OTP input when switching to OTP step
  useEffect(() => {
    if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showError = useCallback((message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  }, []);

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return showError('All fields are required.');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return showError('Please provide a valid email address.');
    }

    setLoading(true);
    try {
      const res = await fetch(sendOtpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStep('otp');
        setOtpCode('');
        setCountdown(OTP_DURATION);
        setResendCooldown(30);
        setSnackbar({
          open: true,
          message: `Verification code sent to ${formData.email}. Check your inbox.`,
          severity: 'info',
        });
      } else if (res.status === 429) {
        setResendCooldown(data.retryAfter || 30);
        showError(data.error || 'Please wait before requesting a new code.');
      } else {
        showError(data.error || 'Failed to send verification code.');
      }
    } catch {
      showError('Unable to send verification code. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      return showError('Please enter the verification code.');
    }
    if (otpCode.trim().length !== 7) {
      return showError('The verification code must be 7 digits.');
    }

    setLoading(true);
    try {
      const res = await fetch(verifyOtpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpCode.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep('done');
        setSnackbar({
          open: true,
          message: 'Message sent successfully! Expect a follow-up soon.',
          severity: 'success',
        });
        // Reset after a moment so the success state is visible
        setTimeout(() => {
          setStep('form');
          setFormData({ name: '', email: '', message: '' });
          setOtpCode('');
        }, 4000);
      } else if (data.expired) {
        // OTP expired or too many attempts — go back to form
        setStep('form');
        showError(data.error || 'Code expired. Please submit the form again.');
      } else {
        showError(data.error || 'Invalid verification code.');
      }
    } catch {
      showError('Verification failed. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const res = await fetch(sendOtpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpCode('');
        setCountdown(OTP_DURATION);
        setResendCooldown(30);
        setSnackbar({ open: true, message: 'New verification code sent!', severity: 'info' });
      } else if (res.status === 429) {
        setResendCooldown(data.retryAfter || 30);
        showError(data.error || 'Please wait before requesting a new code.');
      } else {
        showError(data.error || 'Failed to resend code.');
      }
    } catch {
      showError('Unable to resend code. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  // ── Go back to form step ─────────────────────────────────────────────────
  const handleBackToForm = () => {
    setStep('form');
    setOtpCode('');
    setCountdown(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Format countdown as M:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box component="section" id="contact" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, color: 'text.primary', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
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
              sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}
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
              <AnimatePresence mode="wait">
                {/* ═══════════════════ STEP 1: CONTACT FORM ═══════════════════ */}
                {step === 'form' && (
                  <motion.form
                    key="form-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSendOtp}
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
                          style={inputStyle}
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
                          style={inputStyle}
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
                          style={{ ...inputStyle, resize: 'vertical' }}
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
                          '&:hover': { backgroundColor: 'rgba(100, 255, 218, 0.1)', borderColor: 'primary.main' },
                        }}
                      >
                        {loading ? 'Sending code...' : 'Send Message'}
                      </Button>
                    </Box>
                  </motion.form>
                )}

                {/* ═══════════════════ STEP 2: OTP VERIFICATION ═══════════════════ */}
                {step === 'otp' && (
                  <motion.form
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleVerifyOtp}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace', mb: 1 }}
                        >
                          Email Verification
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          A 7-digit code has been sent to{' '}
                          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {formData.email}
                          </Box>
                        </Typography>
                      </Box>

                      {/* Countdown bar */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: '"Fira Code", monospace' }}>
                            Code expires in
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: countdown < 60 ? 'error.main' : 'primary.main',
                              fontFamily: '"Fira Code", monospace',
                              fontWeight: 700,
                            }}
                          >
                            {formatTime(countdown)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(countdown / OTP_DURATION) * 100}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(136, 146, 176, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: countdown < 60 ? 'error.main' : 'primary.main',
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>

                      {/* OTP input */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>
                          Verification Code
                        </Typography>
                        <input
                          ref={otpInputRef}
                          name="otp"
                          value={otpCode}
                          onChange={(e) => {
                            // Allow only digits, max 7 chars
                            const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                            setOtpCode(val);
                          }}
                          required
                          maxLength={7}
                          placeholder="1234567"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          style={{
                            ...inputStyle,
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            letterSpacing: '0.3em',
                            fontFamily: '"Fira Code", monospace',
                          }}
                        />
                      </Box>

                      <Button
                        type="submit"
                        disabled={loading || otpCode.length !== 7 || countdown <= 0}
                        variant="outlined"
                        sx={{
                          mt: 1,
                          py: 1.5,
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          fontFamily: '"Fira Code", monospace',
                          '&:hover': { backgroundColor: 'rgba(100, 255, 218, 0.1)', borderColor: 'primary.main' },
                        }}
                      >
                        {loading ? 'Verifying...' : 'Verify & Send'}
                      </Button>

                      {/* Resend & Back buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                          onClick={handleBackToForm}
                          disabled={loading}
                          size="small"
                          sx={{ color: 'text.secondary', fontFamily: '"Fira Code", monospace', textTransform: 'none' }}
                        >
                          ← Edit form
                        </Button>
                        <Button
                          onClick={handleResendOtp}
                          disabled={loading || resendCooldown > 0}
                          size="small"
                          sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace', textTransform: 'none' }}
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                        </Button>
                      </Box>
                    </Box>
                  </motion.form>
                )}

                {/* ═══════════════════ STEP 3: SUCCESS ═══════════════════ */}
                {step === 'done' && (
                  <motion.div
                    key="done-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h4" sx={{ color: 'primary.main', mb: 2, fontFamily: '"Fira Code", monospace' }}>
                        ✓
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                        Message Sent!
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Thank you for reaching out. I&apos;ll get back to you soon.
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </motion.div>
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
