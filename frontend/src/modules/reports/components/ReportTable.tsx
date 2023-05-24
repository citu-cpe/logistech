import {
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAuthStore } from '../../../shared/stores';
import { useGetReports } from '../hooks/useGetReports';
import { ReportRow } from './ReportRow';

interface ReportTableProps {}

export const ReportTable: React.FC<ReportTableProps> = () => {
  const { companyId } = useAuthStore();

  const { data, isLoading } = useGetReports(companyId!);

  return isLoading ? (
    <Center>
      <Spinner></Spinner>
    </Center>
  ) : (
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
