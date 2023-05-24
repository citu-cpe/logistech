import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useAuthStore } from '../../../shared/stores';
import { useGetTopTenCustomers } from '../hooks/useGetTopTenCustomers';
import { CustomerRow } from './CustomerRow';

interface CustomerTableProps {}

export const CustomerTable: React.FC<CustomerTableProps> = () => {
  const { companyId } = useAuthStore();

  const { data } = useGetTopTenCustomers(companyId!);

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Company Name</Th>
            <Th>Company Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data.map((c) => (
            <CustomerRow key={c.id} customer={c} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
