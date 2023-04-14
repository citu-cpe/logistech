import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { CART_QUERY_KEY } from "./useGetCart";

export const useRemoveFromCart = () => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (orderItemId: string) => api.deleteOrderItem(orderItemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CART_QUERY_KEY);
        toast.show({
          title: "Removed from cart",
          backgroundColor: "green.700",
          color: "green.50",
        });
      },
    }
  );
};
