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
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useGlobalStore } from '../../../shared/stores';
import { useGetProductItemsByStatus } from '../../products/hooks/useGetProductItemsByStatus';
import { RedFlagRow } from './RedFlagRow';

interface RedFlagTableProps {}

export const RedFlagTable: React.FC<RedFlagTableProps> = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;

  const { data, isLoading } = useGetProductItemsByStatus(
    companyId!,
    ProductItemByStatusDTOStatusEnum.RedFlag
  );

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>RFID</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data.map((p) => (
            <RedFlagRow key={p.id} productItem={p} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
