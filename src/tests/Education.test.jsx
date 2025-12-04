import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Education from '../components/Education';
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

describe('Education Component', () => {
    const mockEducation = [
        {
            title: 'Bachelor of Science',
            institution: 'University of Technology',
            period: '2016 - 2020',
            description: 'Major in Computer Science'
        },
        {
            title: 'Master of Science',
            institution: 'Tech University',
            period: '2020 - 2022',
            description: 'Specialization in AI'
        }
    ];

    it('renders section title', () => {
        renderWithTheme(<Education education={mockEducation} />);
        expect(screen.getByText(/Education/i)).toBeInTheDocument();
    });

    it('renders all education items', () => {
        renderWithTheme(<Education education={mockEducation} />);
        expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
        expect(screen.getByText('Master of Science')).toBeInTheDocument();
    });

    it('renders institution names', () => {
        renderWithTheme(<Education education={mockEducation} />);
        expect(screen.getByText('University of Technology')).toBeInTheDocument();
        expect(screen.getByText('Tech University')).toBeInTheDocument();
    });

    it('renders periods', () => {
        renderWithTheme(<Education education={mockEducation} />);
        expect(screen.getByText('2016 - 2020')).toBeInTheDocument();
        expect(screen.getByText('2020 - 2022')).toBeInTheDocument();
    });

    it('renders descriptions', () => {
        renderWithTheme(<Education education={mockEducation} />);
        expect(screen.getByText('Major in Computer Science')).toBeInTheDocument();
        expect(screen.getByText('Specialization in AI')).toBeInTheDocument();
    });
});
