import { useQueryClient } from "@tanstack/react-query";
import { Box, Divider, ScrollView, Spinner, Text } from "native-base";
import { RefreshControl } from "react-native";
import { HistoryItem } from "../shared/components/HistoryItem";
import {
  OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY,
  useGetOutgoingOrdersForCustomer,
} from "../shared/hooks/useGetOutgoingOrdersForCustomers";

export const HistoryScreen = () => {
  const { data, isLoading, isInitialLoading } =
    useGetOutgoingOrdersForCustomer();
  const queryClient = useQueryClient();

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{ alignItems: "center" }}
      backgroundColor="blueGray.700"
      p="2"
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isInitialLoading}
          onRefresh={() =>
            queryClient.invalidateQueries(
              OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY
            )
          }
          tintColor="white"
        />
      }
    >
      {isInitialLoading && <Spinner />}

      {data?.data.map((o) => (
        <Box key={o.id} w="full">
          <HistoryItem order={o} />

          <Divider />
        </Box>
      ))}

      {data?.data.length === 0 && <Text color="white">No orders</Text>}
    </ScrollView>
  );
};
