import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the engineering foundation landing message', () => {
    render(<HomePage />);
    expect(screen.getByText('Project Fluent')).toBeTruthy();
    expect(screen.getByText('Engineering Foundation Running')).toBeTruthy();
  });
});
