import { Box } from '@chakra-ui/react';
import { UserDTORoleEnum } from 'generated-api';
import React, { ReactNode } from 'react';
import { Manufacturer } from './Manufacturer/Manufacturer';
import { Retailer } from './Retailer/Retailer';
import { StorageFacility } from './StorageFacility/StorageFacility';
import { Supplier } from './Supplier/Supplier';

interface HomeProps {
  role: UserDTORoleEnum;
}

export const Home = ({ role }: HomeProps) => {
  let dashboard: ReactNode;

  if (role === UserDTORoleEnum.Manufacturer) {
    dashboard = <Manufacturer />;
  }
  if (role === UserDTORoleEnum.Supplier) {
    dashboard = <Supplier />;
  }
  if (role === UserDTORoleEnum.Retailer) {
    dashboard = <Retailer />;
  }
  if (role === UserDTORoleEnum.StorageFacility) {
    dashboard = <StorageFacility />;
  }

  return <Box>{dashboard}</Box>;
};
