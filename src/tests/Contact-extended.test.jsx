import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Contact from '../components/Contact';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock Framer Motion (including AnimatePresence used in the 2FA flow)
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line no-unused-vars
    div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, ...props }) => <div {...props}>{children}</div>,
    // eslint-disable-next-line no-unused-vars
    form: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, ...props }) => <form {...props}>{children}</form>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Helper: fill and submit the contact form
async function fillAndSubmitForm() {
  fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText(/Your email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/How can I help\?/i), { target: { value: 'Hello world' } });
  fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
}

const isContactFormTestEnabled = false;

describe.skipIf(!isContactFormTestEnabled)('Contact Component — Extended 2FA Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Form validation (client-side) ──────────────────────────────────────
  describe('Client-side form validation', () => {
    it('should show initial form with all fields empty', () => {
      renderWithTheme(<Contact />);

      const nameInput = screen.getByPlaceholderText(/Your name/i);
      const emailInput = screen.getByPlaceholderText(/Your email/i);
      const messageInput = screen.getByPlaceholderText(/How can I help\?/i);

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    it('should have Send Message button enabled initially', () => {
      renderWithTheme(<Contact />);
      const btn = screen.getByRole('button', { name: /Send Message/i });
      expect(btn).not.toBeDisabled();
    });
  });

  // ── OTP send failure handling ──────────────────────────────────────────
  describe('OTP send failure', () => {
    it('should show error on network failure', async () => {
      window.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
      renderWithTheme(<Contact />);

      // Fill form and submit inside act to handle all resulting state updates
      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Your email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/How can I help\?/i), { target: { value: 'Hello world' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
      });

      // The snackbar error appears in the Alert component
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Unable to send verification code/i);
      });
    });

    it('should show error on server 500 response', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Failed to generate verification code.' }),
      });
      renderWithTheme(<Contact />);

      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByText(/Failed to generate verification code/i)).toBeInTheDocument();
      });
    });

    it('should stay on form step when OTP send fails', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });
      renderWithTheme(<Contact />);

      await fillAndSubmitForm();

      await waitFor(() => {
        // Should still show form fields, not OTP step
        expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
      });
    });

    it('should handle 429 rate limit response', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Please wait 20 seconds before requesting a new code.', retryAfter: 20 }),
      });
      renderWithTheme(<Contact />);

      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByText(/Please wait 20 seconds/i)).toBeInTheDocument();
      });
    });
  });

  // ── OTP step UI ────────────────────────────────────────────────────────
  describe('OTP step UI', () => {
    beforeEach(() => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Code sent.' }),
      });
    });

    it('should show Email Verification title on OTP step', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByText(/Email Verification/i)).toBeInTheDocument();
      });
    });

    it('should display the user email on OTP step', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        // Email appears in both the OTP step text and the snackbar notification
        const matches = screen.getAllByText(/test@example.com/i);
        expect(matches.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should show OTP input with placeholder 1234567', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });
    });

    it('should show Verify & Send button', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Verify & Send/i })).toBeInTheDocument();
      });
    });

    it('should show Edit form and Resend code buttons', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Edit form/i })).toBeInTheDocument();
        // Resend starts in cooldown
        expect(screen.getByText(/Resend in/i)).toBeInTheDocument();
      });
    });

    it('should show countdown timer', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByText(/Code expires in/i)).toBeInTheDocument();
        // Should show time like "5:00"
        expect(screen.getByText(/5:00/)).toBeInTheDocument();
      });
    });
  });

  // ── OTP verification failure ───────────────────────────────────────────
  describe('OTP verification failure', () => {
    beforeEach(() => {
      // Step 1: send-otp success
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    it('should show error for invalid OTP code', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      // Step 2: verify-otp fails with invalid code
      window.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid code. 2 attempt(s) remaining.', expired: false }),
      });

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '0000000' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid code/i)).toBeInTheDocument();
      });
    });

    it('should go back to form when OTP is expired', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      // Step 2: verify-otp returns expired
      window.fetch.mockResolvedValueOnce({
        ok: false,
        status: 410,
        json: async () => ({ error: 'Code expired. Please submit the form again.', expired: true }),
      });

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '1234567' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      // Should return to form step
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
      });
    });

    it('should show error on network failure during verification', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      // Step 2: network error
      window.fetch.mockRejectedValueOnce(new Error('Network error'));

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '1234567' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      await waitFor(() => {
        expect(screen.getByText(/Verification failed/i)).toBeInTheDocument();
      });
    });
  });

  // ── Back to form ───────────────────────────────────────────────────────
  describe('Back to form navigation', () => {
    it('should go back to form when Edit form is clicked', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Edit form/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Edit form/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
      });
    });

    it('should preserve form data when going back', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Edit form/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Edit form/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
      });

      // Form data should be preserved
      expect(screen.getByPlaceholderText(/Your name/i).value).toBe('Test User');
      expect(screen.getByPlaceholderText(/Your email/i).value).toBe('test@example.com');
      expect(screen.getByPlaceholderText(/How can I help\?/i).value).toBe('Hello world');
    });
  });

  // ── Success state ──────────────────────────────────────────────────────
  describe('Success state', () => {
    it('should show success message after full 2FA flow', async () => {
      window.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, queued: 'q-123' }),
        });

      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '9876543' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      await waitFor(() => {
        expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument();
      });

      // Should show thank you text
      expect(screen.getByText(/Thank you for reaching out/i)).toBeInTheDocument();
    });

    it('should show checkmark on success', async () => {
      window.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, direct: true }),
        });

      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '1234567' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument();
      });
    });
  });

  // ── OTP input behavior ─────────────────────────────────────────────────
  describe('OTP input restrictions', () => {
    beforeEach(() => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    it('should have maxLength of 7 on OTP input', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        const otpInput = screen.getByPlaceholderText(/1234567/);
        expect(otpInput.getAttribute('maxLength')).toBe('7');
      });
    });

    it('should have inputMode numeric on OTP input', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        const otpInput = screen.getByPlaceholderText(/1234567/);
        expect(otpInput.getAttribute('inputMode')).toBe('numeric');
      });
    });

    it('should have autocomplete one-time-code on OTP input', async () => {
      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        const otpInput = screen.getByPlaceholderText(/1234567/);
        expect(otpInput.getAttribute('autoComplete')).toBe('one-time-code');
      });
    });
  });

  // ── API call verification ──────────────────────────────────────────────
  describe('API call correctness', () => {
    it('should call /api/send-otp with correct payload', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(window.fetch).toHaveBeenCalledWith(
          '/api/send-otp',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              message: 'Hello world',
            }),
          })
        );
      });
    });

    it('should call /api/verify-otp with email and otp only', async () => {
      window.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, queued: 'q-1' }),
        });

      renderWithTheme(<Contact />);
      await fillAndSubmitForm();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/1234567/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText(/1234567/), { target: { value: '7777777' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

      await waitFor(() => {
        expect(window.fetch).toHaveBeenCalledTimes(2);
      });

      expect(window.fetch).toHaveBeenLastCalledWith(
        '/api/verify-otp',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', otp: '7777777' }),
        })
      );
    });
  });
});
