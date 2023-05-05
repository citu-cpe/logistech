import React from 'react';
import { ProductItemForm } from '../src/modules/products/components/ProductItemForm';
import { renderWithProviders } from './shared';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('ProductItemForm', () => {
  beforeEach(() => {
    renderWithProviders(<ProductItemForm productId='' />);
  });

  it('should have EPC and Status Fields', async () => {
    const epcInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'EPC (Electronic Product Code)',
    });
    const statusSelect = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Status',
    });
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    expect(epcInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('should show error messages if fields are empty and submit button is clicked', async () => {
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    await userEvent.click(saveButton);

    const errorMessages = await waitFor(() => screen.getAllByText(/required/i));

    expect(errorMessages).toHaveLength(1);
  });

  it('should successfully create product item', async () => {
    const epcInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'EPC (Electronic Product Code)',
    });
    const statusSelect = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Status',
    });
    const inStorageOption = screen.getByRole<HTMLOptionElement>('option', {
      name: 'IN STORAGE',
    });

    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    await userEvent.type(epcInput, 'test-rfid');
    await userEvent.selectOptions(statusSelect, inStorageOption);

    await userEvent.click(saveButton);
  });
});
