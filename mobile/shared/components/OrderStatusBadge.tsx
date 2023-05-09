import { OrderDTOStatusEnum } from "generated-api";
import { Badge } from "native-base";

export interface OrderStatusBadgeProps {
  status: OrderDTOStatusEnum;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  let colorScheme = "";

  switch (status) {
    case OrderDTOStatusEnum.Billed:
      colorScheme = "blue";
      break;
    case OrderDTOStatusEnum.Pending:
      colorScheme = "yellow";
      break;
    case OrderDTOStatusEnum.Overdue:
      colorScheme = "red";
      break;
    case OrderDTOStatusEnum.Invoiced:
      colorScheme = "teal";
      break;
    case OrderDTOStatusEnum.Rejected:
      colorScheme = "gray";
      break;
    case OrderDTOStatusEnum.Paid:
      colorScheme = "green";
      break;
  }
  return <Badge colorScheme={colorScheme}>{status.replaceAll("_", " ")}</Badge>;
};
