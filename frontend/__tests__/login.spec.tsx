import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Login } from '../src/modules/login/components/Login';
import { renderWithProviders } from './shared';

describe('LoginForm', () => {
  beforeEach(() => {
    renderWithProviders(<Login />);
  });

  it('should have email and password input fields and submit button', () => {
    const emailInput = screen.getByRole<HTMLInputElement>('textbox');
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const logInButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /log in/i,
    });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(logInButton).toBeInTheDocument();
  });

  it('should show error message if fields are empty and submit button is clicked', async () => {
    const logInButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /log in/i,
    });

    await userEvent.click(logInButton);

    const errorMessages = await waitFor(() => screen.getAllByText(/required/i));

    expect(errorMessages).toHaveLength(2);
  });

  it('should show error message when email is invalid', async () => {
    const emailInput = screen.getByRole<HTMLInputElement>('textbox');

    await userEvent.type(emailInput, 'not_an_email');
    await userEvent.tab();

    const errorMessage = await waitFor(() =>
      screen.getByText(/invalid email/i)
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
