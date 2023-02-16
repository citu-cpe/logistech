import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { OrderDTO } from 'generated-api';
import { OrderRow } from './OrderRow';

interface OrdersTableProps {
  incoming: boolean;
  orders: OrderDTO[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  incoming,
  orders,
}) => {
  return (
    <Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Company</Th>
              <Th>Order date</Th>
              <Th>Status</Th>
              <Th isNumeric>Total</Th>
              {incoming && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} incoming={incoming} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
