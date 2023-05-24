import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useAuthStore } from '../../../shared/stores';
import { useGetSales } from '../../orders/hooks/useGetSales';
import { SalesRow } from './SalesRow';

interface SalesTableProps {}

export const SalesTable: React.FC<SalesTableProps> = ({}) => {
  const { companyId } = useAuthStore();
  const { data, isLoading } = useGetSales(companyId!);

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
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
          {data?.data.map((s) => (
            <SalesRow key={s.product.id} sale={s} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
