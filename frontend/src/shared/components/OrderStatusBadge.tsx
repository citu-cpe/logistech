import { Badge } from '@chakra-ui/react';
import { OrderDTOStatusEnum } from 'generated-api';

interface OrderStatusBadgeProps {
  status: OrderDTOStatusEnum;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  let colorScheme = '';

  switch (status) {
    case OrderDTOStatusEnum.Pending:
      colorScheme = 'yellow';
      break;
    case OrderDTOStatusEnum.Invoiced:
      colorScheme = 'blue';
      break;
    case OrderDTOStatusEnum.Paid:
      colorScheme = 'green';
      break;
    case OrderDTOStatusEnum.Overdue:
      colorScheme = 'red';
      break;
  }

  return <Badge colorScheme={colorScheme}>{status.replaceAll('_', ' ')}</Badge>;
};
