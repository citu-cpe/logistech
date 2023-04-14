import { OrderItemDTO } from "generated-api";
import { Box, Button, Text } from "native-base";
import React from "react";
import { useRemoveFromCart } from "../hooks/useRemoveFromCart";
import { Peso } from "./Peso";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface OrderItemProps {
  orderItem: OrderItemDTO;
}

export const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
  const removeFromCart = useRemoveFromCart();
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
        <Text color="white">Quantity: {orderItem.quantity}</Text>
        <Text>
          <Peso amount={orderItem.total} color="white" />
        </Text>
      </Box>

      <Box>
        <Button
          onPress={() => removeFromCart.mutate(orderItem.id)}
          isLoading={removeFromCart.isLoading}
          backgroundColor="red.700"
        >
          <MaterialCommunityIcons name="delete" color="white" />
        </Button>
      </Box>
    </Box>
  );
};
