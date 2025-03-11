import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { AdminContext } from 'react-admin';

// Mock the Title component from react-admin
jest.mock('react-admin', () => ({
  ...jest.requireActual('react-admin'),
  Title: () => <div data-testid="title">LorePin CMS Dashboard</div>,
}));

describe('Dashboard Component', () => {
  const renderWithAdminContext = (component) => {
    return render(
      <AdminContext>
        {component}
      </AdminContext>
    );
  };

  test('renders welcome message', () => {
    renderWithAdminContext(<Dashboard />);
    
    // Check if the welcome message is rendered
    expect(screen.getByText('Welcome to LorePin CMS')).toBeInTheDocument();
  });

  test('renders all dashboard cards', () => {
    renderWithAdminContext(<Dashboard />);
    
    // Check if all cards are rendered
    expect(screen.getByText('Welcome to LorePin CMS')).toBeInTheDocument();
    expect(screen.getByText('Moderation Queue')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Challenge Management')).toBeInTheDocument();
  });

  test('renders dashboard description', () => {
    renderWithAdminContext(<Dashboard />);
    
    // Check if the description is rendered
    expect(screen.getByText(/This Content Management System allows you to manage users, roles, content moderation, and challenges for the LorePin platform./i)).toBeInTheDocument();
  });
}); 