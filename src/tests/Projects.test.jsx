import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Projects from '../components/Projects';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

    it('renders featured project details and opens the diagram overlay', () => {
        renderWithTheme(
            <Projects
                projects={[
                    {
                        title: 'Self-Hosted Media Platform & Homelab',
                        description: 'Built and operate a self-hosted homelab centered on Jellyfin with 3.6 TB of media on a 1 Gbps line, tested with 10-12 transcoding users or 20 non-transcoding users.',
                        featured: true,
                        image: {
                            src: 'https://blob.example.com/docker-compose-diagram.svg',
                            alt: 'Homelab Docker Compose architecture diagram',
                            caption: 'Stack diagram served from Vercel Blob storage'
                        },
                        disclaimer: {
                            label: 'Project scope disclaimer',
                            text: 'This Jellyfin setup is a private homelab demonstration. It is not a public media service, does not distribute copyrighted content, and is not operated for profit.'
                        },
                        highlights: ['Operate Jellyfin with 3.6 TB of media.'],
                        technologies: ['Jellyfin', 'Docker Compose'],
                        roadmap: 'Next steps include LDAP and SSO.'
                    }
                ]}
            />
        );

        expect(screen.queryByAltText('Homelab Docker Compose architecture diagram')).not.toBeInTheDocument();
        expect(screen.getByText('Operate Jellyfin with 3.6 TB of media.')).toBeInTheDocument();
        expect(screen.getByText(/3.6 TB of media on a 1 Gbps line/)).toBeInTheDocument();
        expect(screen.getByText(/10-12 transcoding users or 20 non-transcoding users/)).toBeInTheDocument();
        expect(screen.getByText('Project scope disclaimer')).toBeInTheDocument();
        expect(screen.getByText(/private homelab demonstration/i)).toBeInTheDocument();
        expect(screen.getByText(/not operated for profit/i)).toBeInTheDocument();
        expect(screen.getByText('Jellyfin')).toBeInTheDocument();
        expect(screen.getByText(/Next steps include LDAP and SSO./i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /view self-hosted media platform & homelab stack diagram/i }));

        expect(screen.getByRole('dialog', { name: /self-hosted media platform & homelab stack diagram/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /zoom in diagram/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /zoom out diagram/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /move diagram left/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /move diagram right/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /move diagram up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /move diagram down/i })).toBeInTheDocument();
        expect(screen.getByAltText('Homelab Docker Compose architecture diagram')).toHaveAttribute(
            'src',
            'https://blob.example.com/docker-compose-diagram.svg'
        );
        expect(screen.getByRole('link', { name: /open full size/i })).toHaveAttribute(
            'href',
            'https://blob.example.com/docker-compose-diagram.svg'
        );
    });
});
