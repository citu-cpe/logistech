import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useGlobalStore } from '../../../shared/stores';
import { useGetReports } from '../hooks/useGetReports';
import { ReportRow } from './ReportRow';

interface ReportTableProps {}

export const ReportTable: React.FC<ReportTableProps> = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;

  const { data } = useGetReports(companyId!);

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Reporter</Th>
            <Th>Product</Th>
            <Th>RFID</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};