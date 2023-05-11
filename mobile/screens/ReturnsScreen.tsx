import { useQueryClient } from "@tanstack/react-query";
import { ProductItemDTOStatusEnum } from "generated-api";
import { ScrollView, Spinner, Text } from "native-base";
import { RefreshControl } from "react-native";
import { ProductItemItem } from "../shared/components/ProductItemItem";
import { ProductItemStatusBadge } from "../shared/components/ProductItemStatusBadge";
import {
  RETURNED_PRODUCT_ITEMS,
  useGetReturnedProductItems,
} from "../shared/hooks/useGetReturnedProductItems";

export const ReturnsScreen = () => {
  const { data, isLoading, isInitialLoading } = useGetReturnedProductItems();
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
            queryClient.invalidateQueries(RETURNED_PRODUCT_ITEMS)
          }
          tintColor="white"
        />
      }
    >
      {isInitialLoading && <Spinner />}

      {data?.data.map((p) => (
        <ProductItemItem productItem={p} key={p.id} />
      ))}

      {data?.data.length === 0 && (
        <Text color="white">
          No{" "}
          <ProductItemStatusBadge status={ProductItemDTOStatusEnum.Returned} />{" "}
          product items
        </Text>
      )}
    </ScrollView>
  );
};
