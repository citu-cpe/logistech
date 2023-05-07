import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderItemDTO } from "generated-api";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { CART_QUERY_KEY } from "./useGetCart";
import { COMMERCE_PRODUCTS_QUERY_KEY } from "./useGetCommerceProducts";

export const useEditOrderItem = (id: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((dto: CreateOrderItemDTO) => api.editOrderItem(id, dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
      queryClient.invalidateQueries(COMMERCE_PRODUCTS_QUERY_KEY);
    },
  });
};
