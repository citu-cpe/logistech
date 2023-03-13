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
  billed?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  allowEdit,
  orders,
  incoming,
  allowPayment,
  showTotal,
  billed,
}) => {
  const getUser = useGlobalStore().getUser;
  const company = getUser()?.company;

  return (
    <Box height='100%'>
      <TableContainer height='100%'>
        <Table variant='simple' height='100%'>
          <Thead>
            <Tr>
              {company?.type !== CompanyDTOTypeEnum.StorageFacility && (
                <Th>{incoming ? 'Customer' : 'Company'}</Th>
              )}

              {company?.type === CompanyDTOTypeEnum.StorageFacility && (
                <Th>Invoice Number</Th>
              )}

              {(billed === undefined || !billed) && <Th>Order date</Th>}

              {(billed === undefined || !billed) && <Th>Status</Th>}

              {billed === undefined && <Th>Storage Facility</Th>}

              {billed === undefined ||
                (billed !== undefined && !!billed && (
                  <>
                    <Th>Courier</Th>
                    <Th>Due date</Th>
                  </>
                ))}

              {billed === undefined && <Th isNumeric>Remaining Balance</Th>}

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
                billed={billed}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
