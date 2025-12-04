import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock portfolio data and package.json
vi.mock('../data/portfolioData', () => ({
    portfolioData: {
        name: 'Test User'
    }
}));

vi.mock('../../package.json', () => ({
    default: {
        version: '1.0.0'
    }
}));

const theme = createTheme();

const renderWithTheme = (component) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('Footer Component', () => {
    it('renders copyright text with name and year', () => {
        renderWithTheme(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} Test User`))).toBeInTheDocument();
    });

    it('renders version number', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByText(/Version\s+1.0.0/)).toBeInTheDocument();
    });

    it('renders technology links', () => {
        renderWithTheme(<Footer />);
        expect(screen.getByRole('link', { name: /React/i })).toHaveAttribute('href', 'https://react.dev');
        expect(screen.getByRole('link', { name: /Vite/i })).toHaveAttribute('href', 'https://vitejs.dev');
        expect(screen.getByRole('link', { name: /Material Design 3/i })).toHaveAttribute('href', 'https://mui.com');
    });
});
