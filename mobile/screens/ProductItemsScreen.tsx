import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from "generated-api";
import { Box, Divider, ScrollView, Spinner, Text } from "native-base";
import { RefreshControl } from "react-native";
import { ProductItemStatusBadge } from "../shared/components/ProductItemStatusBadge";
import {
  PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY,
  useGetProductsByStatusAndUser,
} from "../shared/hooks/useGetProductsByStatusAndUser";
import { HomeStackParamList } from "./HomeStackScreen";

export interface ProductItemsScreenProps {
  companyId?: string;
  status: ProductItemByStatusDTOStatusEnum;
}

export const ProductItemsScreen = ({
  route,
}: NativeStackScreenProps<HomeStackParamList, "ProductItems">) => {
  const { status } = route.params;
  const { data, isLoading, isInitialLoading } =
    useGetProductsByStatusAndUser(status);
  const queryClient = useQueryClient();

  return (
    <ScrollView
      flex={1}
      backgroundColor="blueGray.700"
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isInitialLoading}
          onRefresh={() =>
            queryClient.invalidateQueries(
              PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(status)
            )
          }
          tintColor="white"
        />
      }
    >
      <ProductItemStatusBadge
        status={status as unknown as ProductItemDTOStatusEnum}
      />

      {isInitialLoading && <Spinner />}

      {data?.data.map((p) => (
        <Box key={p.id} w="full">
          <Box p="2">
            <Text color="white" fontWeight="bold" fontSize="lg">
              {p.product?.name}
            </Text>
            <Text color="white">RFID: {p.rfid}</Text>
          </Box>
          <Divider />
        </Box>
      ))}

      {data?.data.length === 0 && (
        <Text color="white" textAlign="center" mt="2">
          No{" "}
          <ProductItemStatusBadge
            status={status as unknown as ProductItemDTOStatusEnum}
          />{" "}
          product items
        </Text>
      )}
    </ScrollView>
  );
};
