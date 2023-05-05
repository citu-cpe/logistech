import React from 'react';
import { ProductForm } from '../src/modules/products/components/ProductForm';
import { renderWithProviders } from './shared';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('ProductForm', () => {
  beforeEach(() => {
    renderWithProviders(<ProductForm companyId='' />);
  });

  it('should have Product Name, Price, Bulk, and Bulk Quantity Fields', async () => {
    const productNameInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Product Name',
    });
    const priceInput = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Price',
    });
    const bulkCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {
      name: 'Bulk',
    });
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    expect(productNameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(bulkCheckbox).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(bulkCheckbox);
    expect(bulkCheckbox).toBeChecked();

    const bulkQuantityInput = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Bulk Quantity',
    });

    expect(bulkQuantityInput).toBeInTheDocument();
  });

  it('should show error messages if fields are empty and submit button is clicked', async () => {
    const productNameInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Product Name',
    });
    const priceInput = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Price',
    });
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    await userEvent.clear(productNameInput);
    await userEvent.clear(priceInput);
    await userEvent.click(saveButton);

    const errorMessages = await waitFor(() => screen.getAllByText(/required/i));

    expect(errorMessages).toHaveLength(2);
  });

  it('should successfully create product', async () => {
    const productNameInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Product Name',
    });
    const priceInput = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Price',
    });
    const bulkCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {
      name: 'Bulk',
    });
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    await userEvent.type(productNameInput, 'Batteries');
    await userEvent.type(priceInput, '100');
    await userEvent.click(bulkCheckbox);

    const bulkQuantityInput = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Bulk Quantity',
    });

    await userEvent.type(bulkQuantityInput, '5');

    await userEvent.click(saveButton);
  });
});
