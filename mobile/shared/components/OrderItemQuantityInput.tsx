import { OrderItemDTO } from "generated-api";
import { Box, Button, Flex, Text } from "native-base";
import React from "react";
import { useEditOrderItem } from "../hooks/useEditOrderItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface OrderItemQuantityInputProps {
  orderItem: OrderItemDTO;
  disabled?: boolean;
  max?: number;
}

export const OrderItemQuantityInput: React.FC<OrderItemQuantityInputProps> = ({
  orderItem,
  disabled,
  max,
}) => {
  const editOrderItem = useEditOrderItem(orderItem.id);

  const onEditOrderItem = (increase: boolean) => {
    if (!increase && orderItem.quantity === 1) {
      return;
    }

    editOrderItem.mutate({
      ...orderItem,
      quantity: increase ? orderItem.quantity + 1 : orderItem.quantity - 1,
      productId: orderItem.product.id,
    });
  };

  return (
    <Box>
      <Flex flexDir="row" mb="2" alignItems="center">
        <Button
          onPress={() => onEditOrderItem(false)}
          isDisabled={
            editOrderItem.isLoading || disabled || orderItem.quantity === 1
          }
        >
          <MaterialIcons name="remove" color="white" />
        </Button>

        <Box mx="4">
          <Text color="white" fontWeight="bold" fontSize="2xl">
            {orderItem.quantity}
          </Text>
        </Box>

        <Button
          onPress={() => onEditOrderItem(true)}
          isDisabled={
            editOrderItem.isLoading || (!!max && orderItem.quantity === max)
          }
        >
          <MaterialIcons name="add" color="white" />
        </Button>
      </Flex>
    </Box>
  );
};
