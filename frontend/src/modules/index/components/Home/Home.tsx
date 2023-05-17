import { Box } from '@chakra-ui/react';
import { CompanyDTOTypeEnum, UserDTORoleEnum } from 'generated-api';
import React, { ReactNode } from 'react';
import { Customer } from './Customer/Customer';
import { Manufacturer } from './Manufacturer/Manufacturer';
import { Retailer } from './Retailer/Retailer';
import { StorageFacility } from './StorageFacility/StorageFacility';
import { Supplier } from './Supplier/Supplier';

interface HomeProps {
  companyType?: CompanyDTOTypeEnum;
  userRole?: UserDTORoleEnum;
}

export const Home = ({ companyType, userRole }: HomeProps) => {
  let dashboard: ReactNode;

  if (companyType === CompanyDTOTypeEnum.Manufacturer) {
    dashboard = <Manufacturer />;
  }
  if (companyType === CompanyDTOTypeEnum.Supplier) {
    dashboard = <Supplier />;
  }
  if (companyType === CompanyDTOTypeEnum.Retailer) {
    dashboard = <Retailer />;
  }
  if (companyType === CompanyDTOTypeEnum.StorageFacility) {
    dashboard = <StorageFacility />;
  }
  if (userRole === UserDTORoleEnum.Customer) {
    dashboard = <Customer />;
  }

  return <Box>{dashboard}</Box>;
};
