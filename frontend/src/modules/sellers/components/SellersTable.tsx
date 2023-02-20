import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@chakra-ui/react';
import { CompanyDTO } from 'generated-api';
import { SellerRow } from './SellersRow';

interface SellersTableProps {
  sellers: CompanyDTO[];
}

export const SellersTable: React.FC<SellersTableProps> = ({ sellers }) => {
  return (
    <Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Company</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sellers.map((s) => (
              <SellerRow key={s.id} seller={s} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
