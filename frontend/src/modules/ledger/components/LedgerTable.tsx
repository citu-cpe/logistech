import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@chakra-ui/react';
import { OrderDTO } from 'generated-api';
import { LedgerRow } from './LedgerRow';

interface LedgerTableProps {
  orders: OrderDTO[];
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ orders }) => {
  return (
    <Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Transaction Date</Th>
              <Th>Customer</Th>
              <Th>Invoice</Th>
              <Th>Billing</Th>
              <Th>DR</Th>
              <Th>CR</Th>
              <Th>Payment Date</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o) => (
              <LedgerRow order={o} key={o.id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
