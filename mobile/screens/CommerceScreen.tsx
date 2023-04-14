import { useQueryClient } from "@tanstack/react-query";
import { CommerceProductDTOCompanyTypesEnum } from "generated-api";
import { ScrollView, Spinner } from "native-base";
import { RefreshControl } from "react-native";
import { CommerceItem } from "../shared/components/CommerceItem";
import {
  COMMERCE_PRODUCTS_QUERY_KEY,
  useGetCommerceProducts,
} from "../shared/hooks/useGetCommerceProducts";
import { useAuthStore } from "../shared/stores/auth";

export const CommerceScreen = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isInitialLoading } = useGetCommerceProducts(
    [
      CommerceProductDTOCompanyTypesEnum.Manufacturer,
      CommerceProductDTOCompanyTypesEnum.Retailer,
    ],
    user?.id
  );
  const queryClient = useQueryClient();

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{ alignItems: "center" }}
      bg="blueGray.700"
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isInitialLoading}
          onRefresh={() =>
            queryClient.invalidateQueries(COMMERCE_PRODUCTS_QUERY_KEY)
          }
          tintColor="white"
        />
      }
    >
      {isInitialLoading && <Spinner />}

      {data?.data.map((p) => (
        <CommerceItem key={p.id} product={p} />
      ))}
    </ScrollView>
  );
};
