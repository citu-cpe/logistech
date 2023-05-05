import React from 'react';
import { OrderForm } from '../src/modules/orders/components/OrderForm';
import { renderWithProviders } from './shared';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  CompanyDTO,
  CompanyDTOTypeEnum,
  OrderDTO,
  OrderDTOStatusEnum,
} from 'generated-api';

const mockOrder: OrderDTO = {
  id: 'test_id',
  createdAt: '',
  updatedAt: '',
  status: OrderDTOStatusEnum.Pending,
  total: 100,
  invoiceNumber: 1,
  finalized: false,
  orderItems: [],
  remainingBalance: 100,
};

const mockPartnerStorageFacilities: CompanyDTO[] = [
  {
    id: 'test_company_id',
    createdAt: '',
    updatedAt: '',
    type: CompanyDTOTypeEnum.StorageFacility,
    name: 'Storage Facility Co.',
    address: 'LA',
    contactNumber: '09994094388',
    email: 'test_storage_facility@test.com',
  },
];

describe('OrderForm', () => {
  beforeEach(() => {
    renderWithProviders(
      <OrderForm
        order={mockOrder}
        incoming={true}
        partnerStorageFacilities={mockPartnerStorageFacilities}
      />
    );
  });

  it('should have Status, Storage Facility', async () => {
    const statusSelect = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Status',
    });
    const storageFacilitySelect = screen.getByRole<HTMLSelectElement>(
      'combobox',
      {
        name: 'Storage Facility',
      }
    );
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    expect(statusSelect).toBeInTheDocument();
    expect(storageFacilitySelect).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('should successfully edit order', async () => {
    const statusSelect = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Status',
    });
    const storageFacilitySelect = screen.getByRole<HTMLSelectElement>(
      'combobox',
      {
        name: 'Storage Facility',
      }
    );
    const pendingOption = screen.getByRole<HTMLOptionElement>('option', {
      name: 'PENDING',
    });
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Save',
    });

    await userEvent.selectOptions(statusSelect, pendingOption);
    await userEvent.selectOptions(
      storageFacilitySelect,
      mockPartnerStorageFacilities[0].name
    );

    await userEvent.click(saveButton);
  });
});
