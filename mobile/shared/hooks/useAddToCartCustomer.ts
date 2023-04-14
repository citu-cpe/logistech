import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderItemDTO } from "generated-api";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { CART_QUERY_KEY } from "./useGetCart";

export const useAddToCartCustomer = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (dto: CreateOrderItemDTO) => api.addItemToCartCustomer(dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CART_QUERY_KEY);
        toast.show({
          title: "Added to cart",
          bgColor: "green.700",
          color: "green.50",
        });
      },
    }
  );
};
