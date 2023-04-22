import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductItemByStatusDTOStatusEnum } from "generated-api";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "./useGetProductsByStatusAndUser";

export const useReturnProductItem = () => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (productItemId: string) => api.returnProductItem(productItemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Complete
          )
        );
        toast.show({
          title: "Updated product item",
          backgroundColor: "green.700",
          color: "green.50",
        });
      },
    }
  );
};
