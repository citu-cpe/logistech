import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { SalesRow } from './SalesRow';

interface SalesTableProps {}

export const SalesTable: React.FC<SalesTableProps> = ({}) => {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Item Sold</Th>
            <Th>Customer</Th>
            <Th isNumeric>Quantity Sold</Th>
            <Th isNumeric>Price</Th>
            <Th>Customer ID</Th>
            <Th>RFID</Th>
            <Th>Payment Status</Th>
            <Th>Delivery Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          <SalesRow />
        </Tbody>
      </Table>
    </TableContainer>
  );
};
