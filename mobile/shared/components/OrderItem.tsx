import { OrderItemDTO } from "generated-api";
import { Box, Button, Flex, Text } from "native-base";
import React from "react";
import { useRemoveFromCart } from "../hooks/useRemoveFromCart";
import { Peso } from "./Peso";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEditOrderItem } from "../hooks/useEditOrderItem";
import { OrderItemQuantityInput } from "./OrderItemQuantityInput";

interface OrderItemProps {
  orderItem: OrderItemDTO;
}

export const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
  const removeFromCart = useRemoveFromCart();
  const editOrderItem = useEditOrderItem(orderItem.id);

  const isLoading = removeFromCart.isLoading || editOrderItem.isLoading;

  return (
    <Box
      key={orderItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="gray.800"
      p="2"
      mb="2"
    >
      <Box>
        <Text color="white">{orderItem.product.name}</Text>
        <Text>
          <Peso amount={orderItem.total} color="white" />
        </Text>
      </Box>

      <Box>
        <OrderItemQuantityInput
          orderItem={orderItem}
          max={orderItem.product.numInStock}
        />
      </Box>

      <Box>
        <Button
          onPress={() => removeFromCart.mutate(orderItem.id)}
          isDisabled={isLoading}
          isLoading={removeFromCart.isLoading}
          backgroundColor="red.700"
        >
          <MaterialCommunityIcons name="delete" color="white" />
        </Button>
      </Box>
    </Box>
  );
};
