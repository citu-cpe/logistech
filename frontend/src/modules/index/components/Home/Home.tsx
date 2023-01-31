import { Box } from '@chakra-ui/react';
import { CompanyDTOTypeEnum } from 'generated-api';
import React, { ReactNode } from 'react';
import { Manufacturer } from './Manufacturer/Manufacturer';
import { Retailer } from './Retailer/Retailer';
import { StorageFacility } from './StorageFacility/StorageFacility';
import { Supplier } from './Supplier/Supplier';

interface HomeProps {
  companyType: CompanyDTOTypeEnum;
}

export const Home = ({ companyType }: HomeProps) => {
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

  return <Box>{dashboard}</Box>;
};
