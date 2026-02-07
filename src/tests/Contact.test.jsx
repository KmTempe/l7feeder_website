import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('Contact Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders contact form inputs', () => {
        renderWithTheme(<Contact />);

        expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Your email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/How can I help\?/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
    });

    it('submits form and requests OTP verification', async () => {
        // Step 1: send-otp returns success
        window.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Verification code sent.' }),
        });

        renderWithTheme(<Contact />);

        fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Your email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/How can I help\?/i), { target: { value: 'Hello world' } });

        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledTimes(1);
        });

        // Should call send-otp, not contact
        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/send-otp'),
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

        // Should transition to OTP step
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/1234567/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Verify & Send/i })).toBeInTheDocument();
        });
    });

    it('verifies OTP and sends message', async () => {
        // Step 1: send-otp success
        window.fetch = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            })
            // Step 2: verify-otp success
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, queued: 'q-123' }),
            });

        renderWithTheme(<Contact />);

        // Fill and submit form
        fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Your email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/How can I help\?/i), { target: { value: 'Hello world' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

        // Wait for OTP step
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/1234567/i)).toBeInTheDocument();
        });

        // Enter OTP and verify
        fireEvent.change(screen.getByPlaceholderText(/1234567/i), { target: { value: '9876543' } });
        fireEvent.click(screen.getByRole('button', { name: /Verify & Send/i }));

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledTimes(2);
        });

        expect(window.fetch).toHaveBeenLastCalledWith(
            expect.stringContaining('/api/verify-otp'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', otp: '9876543' }),
            })
        );

        // Should show success
        await waitFor(() => {
            expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument();
        });
    });
});
