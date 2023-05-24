import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductItemStatusDTO } from "generated-api";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { COURIER_PRODUCT_ITEMS } from "./useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "./useGetProductsByStatusAndUser";
import { RETURNED_PRODUCT_ITEMS } from "./useGetReturnedProductItems";

export const useUpdateProductItemStatus = (productItemId: string) => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (dto: UpdateProductItemStatusDTO) =>
      api.updateProductItemStatus(productItemId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY
        );
        queryClient.invalidateQueries(RETURNED_PRODUCT_ITEMS);
        toast.show({
          title: "Updated product item",
          backgroundColor: "green.700",
          color: "green.50",
        });
      },
    }
  );
};
