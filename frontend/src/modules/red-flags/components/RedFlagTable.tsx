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
import {
  ProductItemByStatusDTOStatusEnum,
  UserDTORoleEnum,
} from 'generated-api';
import { useGlobalStore } from '../../../shared/stores';
import { useGetProductItemsByStatus } from '../../products/hooks/useGetProductItemsByStatus';
import { useGetProductItemsByStatusAndUser } from '../../products/hooks/useGetProductItemsByStatusAndUser';
import { RedFlagRow } from './RedFlagRow';

interface RedFlagTableProps {}

export const RedFlagTable: React.FC<RedFlagTableProps> = () => {
  const getUser = useGlobalStore().getUser;
  const user = getUser();
  const companyId = user?.company?.id;

  const { data, isLoading } = useGetProductItemsByStatus(
    companyId,
    ProductItemByStatusDTOStatusEnum.RedFlag
  );

  const {
    data: customerProductItemsData,
    isLoading: customerProductItemsIsLoading,
  } = useGetProductItemsByStatusAndUser(
    ProductItemByStatusDTOStatusEnum.RedFlag
  );

  const isCustomer = user?.role === UserDTORoleEnum.Customer;

  const actualIsLoading = isCustomer
    ? customerProductItemsIsLoading
    : isLoading;
  const actualData = isCustomer ? customerProductItemsData : data;

  return actualIsLoading ? (
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
            {!isCustomer && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {actualData?.data.map((p) => (
            <RedFlagRow key={p.id} productItem={p} isCustomer={isCustomer} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
