import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Projects from '../components/Projects';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line no-unused-vars
        div: ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, variants, viewport, ...props }) => <div {...props}>{children}</div>,
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

describe('Projects Component', () => {
    const mockProjects = [
        {
            title: 'Project 1',
            description: 'Description 1',
            link: 'https://example.com/1'
        },
        {
            title: 'Project 2',
            description: 'Description 2',
            // No link
        }
    ];

    it('renders section title', () => {
        renderWithTheme(<Projects projects={mockProjects} />);
        expect(screen.getByText(/Some Things I've Built/i)).toBeInTheDocument();
    });

    it('renders all projects', () => {
        renderWithTheme(<Projects projects={mockProjects} />);
        expect(screen.getByText('Project 1')).toBeInTheDocument();
        expect(screen.getByText('Project 2')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('renders project links when available', () => {
        renderWithTheme(<Projects projects={mockProjects} />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAttribute('href', 'https://example.com/1');
    });

    it('renders correct number of project cards', () => {
        renderWithTheme(<Projects projects={mockProjects} />);
        // We can check for the project titles to count
        expect(screen.getAllByText(/Project \d/)).toHaveLength(2);
    });
});
