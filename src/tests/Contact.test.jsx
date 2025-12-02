import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from '../components/Contact';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line no-unused-vars
        div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, ...props }) => <div {...props}>{children}</div>,
    },
    useInView: () => true,
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

    it('submits form data correctly', async () => {
        window.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        renderWithTheme(<Contact />);

        fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Your email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/How can I help\?/i), { target: { value: 'Hello world' } });

        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledTimes(1);
        });

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/contact'),
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

        await waitFor(() => {
            expect(screen.getByText(/Message sent!/i)).toBeInTheDocument();
        });
    });
});
