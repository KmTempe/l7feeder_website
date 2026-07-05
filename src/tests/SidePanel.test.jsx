import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SidePanel from '../components/SidePanel';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { testPortfolioData } from './testPortfolioData';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line no-unused-vars
        div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, ...props }) => <div {...props}>{children}</div>,
    },
}));

// Mock React PDF Renderer components
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

const theme = createTheme();

const renderWithTheme = (component) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('SidePanel Component', () => {
    beforeEach(() => {
        // Mock scrollIntoView
        Element.prototype.scrollIntoView = vi.fn();
    });

    it('renders navigation items', () => {
        renderWithTheme(<SidePanel mobileOpen={true} onClose={() => { }} portfolioData={testPortfolioData} />);

        expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Experience')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Education')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Skills')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Contact')[0]).toBeInTheDocument();
    });

    it('renders social links', () => {
        renderWithTheme(<SidePanel mobileOpen={true} onClose={() => { }} portfolioData={testPortfolioData} />);

        const githubLinks = screen.queryAllByRole('link', { name: /GitHub/i });
        expect(githubLinks.length).toBeGreaterThan(0);
        expect(githubLinks[0]).toBeInTheDocument();

        const instagramLinks = screen.queryAllByRole('link', { name: /Instagram/i });
        expect(instagramLinks.length).toBeGreaterThan(0);
        expect(instagramLinks[0]).toBeInTheDocument();
    });

    it('navigates to section on click', () => {
        const onCloseMock = vi.fn();
        renderWithTheme(<SidePanel mobileOpen={true} onClose={onCloseMock} portfolioData={testPortfolioData} />);

        // Mock document.querySelector to return an element
        const mockElement = document.createElement('div');
        mockElement.scrollIntoView = vi.fn();
        vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

        fireEvent.click(screen.getAllByText('Experience')[0]);

        expect(document.querySelector).toHaveBeenCalledWith('#experience');
        expect(mockElement.scrollIntoView).toHaveBeenCalled({ behavior: 'smooth', block: 'start' });
        expect(onCloseMock).toHaveBeenCalled();
    });
});
