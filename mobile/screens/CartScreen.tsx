import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Button, Heading, ScrollView, Spinner, Text } from "native-base";
import { Peso } from "../shared/components/Peso";
import {
  CUSTOMER_CART_QUERY_KEY,
  useGetCartCustomer,
} from "../shared/hooks/useGetCartCustomer";
import { useRemoveFromCart } from "../shared/hooks/useRemoveFromCart";
import { CartStackParamList } from "./CartStackScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useCreateOrdersForCustomer } from "../shared/hooks/useCreateOrdersCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshControl } from "react-native";
import { OrderItem } from "../shared/components/OrderItem";

export const CartScreen = ({}: NativeStackScreenProps<
  CartStackParamList,
  "Cart"
>) => {
  const { data, isLoading, isInitialLoading } = useGetCartCustomer();
  const cart = data?.data;
  const createOrders = useCreateOrdersForCustomer();
  const queryClient = useQueryClient();

  return (
    <ScrollView
      flex={1}
      backgroundColor="blueGray.700"
      p="2"
      contentContainerStyle={{
        alignItems: "center",
      }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isInitialLoading}
          onRefresh={() =>
            queryClient.invalidateQueries(CUSTOMER_CART_QUERY_KEY)
          }
          tintColor="white"
        />
      }
    >
      {isInitialLoading && <Spinner />}

      {cart && (
        <>
          {cart.groupedOrderItems.map((o) => (
            <Box key={o.company.id} w="full">
              <Heading color="white" mb="2">
                {o.company.name}
              </Heading>
              {o.orderItems.map((oi) => (
                <OrderItem orderItem={oi} />
              ))}
            </Box>
          ))}

          <Box
            display="flex"
            justifyContent="flex-end"
            flexDir="row"
            w="full"
            mb="2"
          >
            <Heading color="white">
              <Text>Total: </Text>
              <Text>
                <Peso amount={cart.total!} fontWeight="bold" />
              </Text>
            </Heading>
          </Box>

          <Button
            onPress={() => createOrders.mutate(cart)}
            isLoading={createOrders.isLoading}
            disabled={cart.groupedOrderItems.length === 0}
            backgroundColor="gray.500"
            w="full"
          >
            Order now
          </Button>
        </>
      )}
    </ScrollView>
  );
};
