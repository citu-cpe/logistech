import { Box, Checkbox, Td, Tr } from '@chakra-ui/react';
import { OrderDTO } from 'generated-api';
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
        <Checkbox defaultChecked={order.finalized} disabled />
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
            let runningBalance = 0;

            for (let i = 0; i < idx; i++) {
              runningBalance += order.payments![i].amount;
            }

            paid = runningBalance;
          }

          return (
            <Box key={p.id}>
              <Peso amount={order.total - paid} />
            </Box>
          );
        })}
      </Td>
    </Tr>
  );
};
