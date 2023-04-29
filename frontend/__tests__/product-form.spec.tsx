import React from 'react';
import { ProductForm } from '../src/modules/products/components/ProductForm';
import { renderWithProviders } from './shared';

describe('ProductForm', () => {
  it('should pass', () => {
    renderWithProviders(<ProductForm companyId='' />);
  });
});
