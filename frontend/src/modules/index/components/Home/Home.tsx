import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Manufacturer } from './Manufacturer/Manufacturer';
import { Retailer } from './Retailer/Retailer';
import { StorageFacility } from './StorageFacility/StorageFacility';
import { Supplier } from './Supplier/Supplier';

export type Role =
  | 'STORAGE_FACILITY'
  | 'SUPPLIER'
  | 'MANUFACTURER'
  | 'RETAILER';

interface HomeProps {
  role: Role;
}

export const Home = ({ role }: HomeProps) => {
  let dashboard: ReactNode;

  if (role === 'MANUFACTURER') {
    dashboard = <Manufacturer />;
  }
  if (role === 'SUPPLIER') {
    dashboard = <Supplier />;
  }
  if (role === 'RETAILER') {
    dashboard = <Retailer />;
  }
  if (role === 'STORAGE_FACILITY') {
    dashboard = <StorageFacility />;
  }

  return <Box>{dashboard}</Box>;
};
