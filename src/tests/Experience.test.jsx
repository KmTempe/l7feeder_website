import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Experience from '../components/Experience';
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

describe('Experience Component', () => {
    const mockExperience = [
        {
            title: 'Software Engineer',
            company: 'Tech Corp',
            period: '2020 - Present',
            responsibilities: ['Developed features', 'Fixed bugs']
        },
        {
            title: 'Intern',
            institution: 'University Lab', // Using institution as fallback for company
            period: '2019 - 2020',
            description: 'Research project'
        }
    ];

    it('renders section title', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText(/Where I've Worked/i)).toBeInTheDocument();
    });

    it('renders all experience items', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Intern')).toBeInTheDocument();
    });

    it('renders company or institution names', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText(/@ Tech Corp/)).toBeInTheDocument();
        expect(screen.getByText(/@ University Lab/)).toBeInTheDocument();
    });

    it('renders periods', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText('2020 - Present')).toBeInTheDocument();
        expect(screen.getByText('2019 - 2020')).toBeInTheDocument();
    });

    it('renders responsibilities list', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText('Developed features')).toBeInTheDocument();
        expect(screen.getByText('Fixed bugs')).toBeInTheDocument();
    });

    it('renders description', () => {
        renderWithTheme(<Experience experience={mockExperience} />);
        expect(screen.getByText('Research project')).toBeInTheDocument();
    });
});
