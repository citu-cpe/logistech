import { OrderDTO, OrderDTOStatusEnum } from "generated-api";
import { Box, Button, Flex, Text } from "native-base";
import { useCreatePayment } from "../hooks/useCreatePayment";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Peso } from "./Peso";

export interface HistoryItemProps {
  order: OrderDTO;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ order }) => {
  const createPayment = useCreatePayment();

  return (
    <Box py="2">
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Text color="white" fontWeight="semibold" fontSize="md" mb="2">
            {order.toCompany?.name}
          </Text>
          {order.courier && (
            <Text color="white" mb="2">
              Courier: {order.courier.username}
            </Text>
          )}
          <Text>
            <OrderStatusBadge status={order.status} />
          </Text>

          {order.status === OrderDTOStatusEnum.Billed && (
            <Text color="white" fontWeight="bold" fontSize="xl">
              Total: <Peso amount={order.remainingBalance} />
            </Text>
          )}
        </Box>

        <Box>
          {order.status === OrderDTOStatusEnum.Billed && (
            <Button
              isLoading={createPayment.isLoading}
              isDisabled={order.status !== OrderDTOStatusEnum.Billed}
              onPress={() =>
                createPayment.mutate({
                  amount: order.remainingBalance,
                  orderId: order.id,
                  isMobile: true,
                })
              }
            >
              Pay
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
