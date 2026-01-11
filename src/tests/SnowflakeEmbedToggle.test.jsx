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

    fireEvent.click(screen.getByRole('button', { name: /close snowflake widget/i }));
    expect(screen.queryByRole('dialog', { name: /snowflake widget/i })).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<SnowflakeEmbedToggle />);

    fireEvent.click(screen.getByRole('button', { name: /open snowflake widget/i }));
    expect(screen.getByRole('dialog', { name: /snowflake widget/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /snowflake widget/i })).not.toBeInTheDocument();
  });
});
