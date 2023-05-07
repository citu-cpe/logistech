import { Box, Text, Tr, Td } from '@chakra-ui/react';
import { SalesDTO } from 'generated-api';
import { OrderStatusBadge } from '../../../shared/components/OrderStatusBadge';
import { Peso } from '../../../shared/components/Peso';
import { ProductItemStatusBadge } from '../../../shared/components/ProductItemStatusBadge';

interface SalesRowProps {
  sale: SalesDTO;
}

export const SalesRow: React.FC<SalesRowProps> = ({ sale }) => {
  const salesItems = sale.salesItems;

  return (
    <Tr>
      <Td>{sale.product.name}</Td>

      <Td>
        {salesItems.map((s) => (
          <Text key={s.customer?.id ?? s.user?.id}>
            {s.customer?.name ?? s.user?.username}
          </Text>
        ))}
      </Td>

      <Td isNumeric>
        {salesItems.map((s) => (
          <Text key={s.customer?.id ?? s.user?.id}>
            {s.orderItems.reduce((quantity, o) => quantity + o.quantity, 0)}
          </Text>
        ))}
      </Td>

      <Td isNumeric>
        {salesItems.map((s) => (
          <Box key={s.customer?.id ?? s.user?.id}>
            <Peso
              amount={s.orderItems.reduce((total, o) => total + o.total, 0)}
            />
          </Box>
        ))}
      </Td>

      <Td>
        {salesItems.map((s) => (
          <Text key={s.customer?.id ?? s.user?.id}>
            {s.customer?.id ?? s.user?.id}
          </Text>
        ))}
      </Td>

      <Td>
        {salesItems.map((s) =>
          s.orderItems.map((o) =>
            o.productItems?.map((p) => <Text key={p.id}>{p.rfid}</Text>)
          )
        )}
      </Td>

      <Td>
        {salesItems.map((s) => (
          <Box key={s.customer?.id ?? s.user?.id}>
            <OrderStatusBadge status={s.orderItems[0].order?.status!} />
          </Box>
        ))}
      </Td>

      <Td>
        {salesItems.map((s) => (
          <Box key={s.customer?.id ?? s.user?.id}>
            <ProductItemStatusBadge
              status={s.orderItems[0].productItems![0].status!}
            />
          </Box>
        ))}
      </Td>
    </Tr>
  );
};
