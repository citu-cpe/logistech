import { Badge, ChakraProps } from '@chakra-ui/react';
import { CompanyDTOTypeEnum } from 'generated-api';

interface CompanyTypeBadgeProps {
  companyType: CompanyDTOTypeEnum;
}

export const CompanyTypeBadge: React.FC<
  CompanyTypeBadgeProps & ChakraProps
> = ({ companyType, ...props }) => {
  let colorScheme = '';

  switch (companyType) {
    case CompanyDTOTypeEnum.Retailer:
      colorScheme = 'yellow';
      break;
    case CompanyDTOTypeEnum.Supplier:
      colorScheme = 'blue';
      break;
    case CompanyDTOTypeEnum.Manufacturer:
      colorScheme = 'green';
      break;
    case CompanyDTOTypeEnum.StorageFacility:
      colorScheme = 'red';
      break;
  }

  return (
    <Badge colorScheme={colorScheme} {...props}>
      {companyType.replaceAll('_', ' ')}
    </Badge>
  );
};
