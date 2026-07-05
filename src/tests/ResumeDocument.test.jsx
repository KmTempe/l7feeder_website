import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeDocument from '../components/ResumeDocument';

vi.mock('@react-pdf/renderer', () => ({
    Document: ({ children, title, author }) => (
        <div data-testid="document" data-title={title} data-author={author}>
            {children}
        </div>
    ),
    Page: ({ children }) => <div>{children}</div>,
    Text: ({ children }) => <span>{children}</span>,
    View: ({ children }) => <div>{children}</div>,
    StyleSheet: { create: (styles) => styles },
}));

describe('ResumeDocument', () => {
    it('renders profile, contact, and schema-shaped skills', () => {
        render(<ResumeDocument />);

        expect(screen.getByTestId('document')).toHaveAttribute('data-author', 'Kosmas Temperekidis');
        expect(screen.getByText('Kosmas Temperekidis')).toBeInTheDocument();
        expect(screen.getByText('IT Applications & Technical Support')).toBeInTheDocument();
        expect(screen.getByText('support@l7feeders.dev')).toBeInTheDocument();
        expect(screen.getByText(/Docker Compose/)).toBeInTheDocument();
        expect(screen.queryByText(/Working in High Stress Environments/)).not.toBeInTheDocument();
    });
});
