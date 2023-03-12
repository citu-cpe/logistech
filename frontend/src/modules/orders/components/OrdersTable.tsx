import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CompanyDTOTypeEnum, OrderDTO } from 'generated-api';
import { useGlobalStore } from '../../../shared/stores';
import { OrderRow } from './OrderRow';

interface OrdersTableProps {
  allowEdit: boolean;
  orders: OrderDTO[];
  incoming: boolean;
  allowPayment: boolean;
  showTotal: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  allowEdit,
  orders,
  incoming,
  allowPayment,
  showTotal,
}) => {
  const getUser = useGlobalStore().getUser;
  const company = getUser()?.company;

  return (
    <Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              {company?.type !== CompanyDTOTypeEnum.StorageFacility && (
                <Th>{incoming ? 'Customer' : 'Company'}</Th>
              )}
              {company?.type === CompanyDTOTypeEnum.StorageFacility && (
                <>
                  <Th>From Company</Th>
                  <Th>To Company</Th>
                </>
              )}
              <Th>Order date</Th>
              <Th>Status</Th>
              <Th>Storage Facility</Th>
              <Th>Courier</Th>
              <Th>Due date</Th>
              {showTotal && <Th isNumeric>Total</Th>}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                incoming={incoming}
                allowEdit={allowEdit}
                company={company!}
                allowPayment={allowPayment}
                showTotal={showTotal}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
