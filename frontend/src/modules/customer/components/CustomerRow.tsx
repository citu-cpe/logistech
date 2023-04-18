import { Tr, Td } from '@chakra-ui/react';
import { CompanyDTO } from 'generated-api';
import { CompanyTypeBadge } from '../../../shared/components/CompanyTypeBadge';

interface CustomerRowProps {
  customer: CompanyDTO;
}

export const CustomerRow: React.FC<CustomerRowProps> = ({ customer }) => {
  return (
    <Tr>
      <Td>{customer.name}</Td>
      <Td>
        <CompanyTypeBadge companyType={customer.type} />
      </Td>
    </Tr>
  );
};
