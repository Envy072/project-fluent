import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the landing page with Sign Up and Sign In links', () => {
    render(<HomePage />);
    expect(screen.getByText('Project Fluent')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeTruthy();
  });
});
