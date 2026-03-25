import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line no-unused-vars
        div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, viewport, ...props }) => <div {...props}>{children}</div>,
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: () => ({ get: () => 0 }),
    useTransform: () => ({ get: () => 0 }),
    useInView: () => true,
}));

// Mock Vercel Analytics
vi.mock('@vercel/analytics/react', () => ({
    Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/react', () => ({
    SpeedInsights: () => null,
}));

// Mock React PDF Renderer components (used in SidePanel)
vi.mock('@react-pdf/renderer', () => ({
    BlobProvider: ({ children }) => <div>{children({ loading: false, url: 'blob:mock-url' })}</div>,
    Document: () => <div>Document</div>,
    Page: () => <div>Page</div>,
    Text: () => <div>Text</div>,
    View: () => <div>View</div>,
    StyleSheet: { create: () => ({}) },
    Font: { register: () => { } },
}));

// Mock ResumeDocument
vi.mock('../components/ResumeDocument', () => ({
    default: () => <div>Resume Document</div>,
}));

describe('App Component', () => {
    beforeEach(() => {
        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query.includes('min-width: 1536px') || query.includes('min-width: 1200px'), // Simulate desktop
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('renders without crashing on desktop', async () => {
        render(<App />);
        // Wait for lazy loaded components
        await waitFor(() => {
            expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument();
        });
    });

    it('renders without crashing on mobile', async () => {
        // Simulate mobile viewport
        window.innerWidth = 375;
        window.innerHeight = 667;
        window.dispatchEvent(new Event('resize'));

        render(<App />);
        await waitFor(() => {
            expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument();
        });
    });
});
