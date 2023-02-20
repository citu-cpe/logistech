import { Tr, Td } from '@chakra-ui/react';
import { CompanyDTO } from 'generated-api';

interface SellerRow {
  seller: CompanyDTO;
}

export const SellerRow: React.FC<SellerRow> = ({ seller }) => {
  return (
    <Tr>
      <Td>{seller.name}</Td>
    </Tr>
  );
};
