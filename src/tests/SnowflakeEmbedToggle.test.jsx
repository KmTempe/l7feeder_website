import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SnowflakeEmbedToggle from '../components/SnowflakeEmbedToggle';

describe('SnowflakeEmbedToggle', () => {
  it('renders the toggle button', () => {
    render(<SnowflakeEmbedToggle />);
    expect(screen.getByRole('button', { name: /open snowflake widget/i })).toBeInTheDocument();
  });

  it('opens and closes the widget panel', () => {
    render(<SnowflakeEmbedToggle />);

    fireEvent.click(screen.getByRole('button', { name: /open snowflake widget/i }));

    expect(screen.getByRole('dialog', { name: /snowflake widget/i })).toBeInTheDocument();
    expect(screen.getByTitle(/snowflake \(tor project\)/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close snowflake panel/i }));
    expect(screen.queryByRole('dialog', { name: /snowflake widget/i })).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<SnowflakeEmbedToggle />);

    fireEvent.click(screen.getByRole('button', { name: /open snowflake widget/i }));
    expect(screen.getByRole('dialog', { name: /snowflake widget/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /snowflake widget/i })).not.toBeInTheDocument();
  });

  it('uses configured labels and URLs', () => {
    render(
      <SnowflakeEmbedToggle
        config={{
          enabled: true,
          preload: false,
          title: 'Bridge',
          iframeTitle: 'Bridge iframe',
          widgetUrl: 'https://example.com/embed.html',
          siteUrl: 'https://example.com/',
          openLabel: 'Open bridge widget',
          closeLabel: 'Hide bridge widget',
          tooltip: 'Open bridge access',
          websiteLabel: 'Open bridge website',
          description: 'Configured bridge description.',
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /open bridge widget/i }));

    expect(screen.getByRole('dialog', { name: /bridge widget/i })).toBeInTheDocument();
    expect(screen.getByTitle(/bridge iframe/i)).toHaveAttribute('src', 'https://example.com/embed.html');
    expect(screen.getByRole('link', { name: /open bridge website/i })).toHaveAttribute('href', 'https://example.com/');
    expect(screen.getByText(/Configured bridge description./i)).toBeInTheDocument();
  });
});
