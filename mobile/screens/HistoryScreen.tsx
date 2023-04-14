import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from "generated-api";
import { Box, ScrollView, Spinner, Text } from "native-base";
import { RefreshControl } from "react-native";
import { ProductItemStatusBadge } from "../shared/components/ProductItemStatusBadge";
import {
  PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY,
  useGetProductsByStatusAndUser,
} from "../shared/hooks/useGetProductsByStatusAndUser";

export const HistoryScreen = () => {
  const { data, isLoading, isInitialLoading } = useGetProductsByStatusAndUser(
    ProductItemByStatusDTOStatusEnum.Complete
  );
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
              PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
                ProductItemByStatusDTOStatusEnum.Complete
              )
            )
          }
          tintColor="white"
        />
      }
    >
      {isInitialLoading && <Spinner />}

      {data?.data.map((p) => (
        <Box w="full" py="2" key={p.id}>
          <Text color="white">Product name: {p.product?.name}</Text>
          <Text color="white">RFID: {p.rfid}</Text>
        </Box>
      ))}

      {data?.data.length === 0 && (
        <Text color="white">
          No{" "}
          <ProductItemStatusBadge status={ProductItemDTOStatusEnum.Complete} />{" "}
          product items
        </Text>
      )}
    </ScrollView>
  );
};
