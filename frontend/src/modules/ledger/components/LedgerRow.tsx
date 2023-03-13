import { Box, Checkbox, Td, Tr } from '@chakra-ui/react';
import { OrderDTO, OrderDTOStatusEnum } from 'generated-api';
import { Peso } from '../../../shared/components/Peso';

interface LedgerRowProps {
  order: OrderDTO;
}

export const LedgerRow: React.FC<LedgerRowProps> = ({ order }) => {
  return (
    <Tr>
      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
      <Td>{order.fromCompany?.name}</Td>
      <Td>{order.invoiceNumber}</Td>
      <Td>
        <Checkbox
          defaultChecked={order.status === OrderDTOStatusEnum.Billed}
          disabled
        />
      </Td>
      <Td>
        <Peso amount={order.total} />
      </Td>
      <Td>
        {order.payments?.map((p) => (
          <Box key={p.id}>
            <Peso amount={p.amount} />
          </Box>
        ))}
      </Td>
      <Td>
        {order.payments?.map((p) => (
          <Box key={p.id}>{new Date(p.createdAt).toLocaleDateString()}</Box>
        ))}
      </Td>
      <Td>
        {order.payments?.map((p, idx) => {
          let paid = 0;

          if (idx === 0) {
            paid = p.amount;
          } else {
            let runningBalance = p.amount;

            for (let i = 0; i < idx; i++) {
              runningBalance += order.payments![i].amount;
            }

            paid = runningBalance;
          }

          return (
            <Box key={p.id}>
              <Peso amount={order.total + (order.shippingFee ?? 0) - paid} />
            </Box>
          );
        })}
      </Td>
    </Tr>
  );
};
