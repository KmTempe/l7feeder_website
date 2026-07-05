import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Skills from '../components/Skills';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { testPortfolioData, getTestSection } from './testPortfolioData';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line no-unused-vars
        div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, viewport, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
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

describe('Skills Component', () => {
    const mockSkills = testPortfolioData.skills;

    it('renders section title', () => {
        renderWithTheme(<Skills skills={mockSkills} section={getTestSection('skills')} />);
        expect(screen.getByText(/Expertise/i)).toBeInTheDocument();
    });

    it('renders all skill categories', () => {
        renderWithTheme(<Skills skills={mockSkills} section={getTestSection('skills')} />);
        expect(screen.getByText('Languages')).toBeInTheDocument();
        expect(screen.getByText('Frameworks')).toBeInTheDocument();
        expect(screen.getByText('Tools & Platforms')).toBeInTheDocument();
    });

    it('renders all skill items', () => {
        renderWithTheme(<Skills skills={mockSkills} section={getTestSection('skills')} />);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(screen.getByText('Git')).toBeInTheDocument();
        expect(screen.getByText('Docker')).toBeInTheDocument();
    });

    it('opens correct link when clicking Git skill', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => { });
        renderWithTheme(<Skills skills={mockSkills} section={getTestSection('skills')} />);

        const gitChip = screen.getByText('Git');
        fireEvent.click(gitChip);

        expect(openSpy).toHaveBeenCalledWith('https://github.com/KmTempe/portfolio-react', '_blank');
        openSpy.mockRestore();
    });

    it('opens correct link when clicking Next.js skill', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => { });
        renderWithTheme(<Skills skills={mockSkills} section={getTestSection('skills')} />);

        const nextJsChip = screen.getByText('Next.js');
        fireEvent.click(nextJsChip);

        expect(openSpy).toHaveBeenCalledWith('https://binlookup.l7feeders.dev/', '_blank');
        openSpy.mockRestore();
    });
});
