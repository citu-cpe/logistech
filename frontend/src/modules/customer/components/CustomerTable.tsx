import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useGlobalStore } from '../../../shared/stores';
import { useGetTopTenCustomers } from '../hooks/useGetTopTenCustomers';
import { CustomerRow } from './CustomerRow';

interface CustomerTableProps {}

export const CustomerTable: React.FC<CustomerTableProps> = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;

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
