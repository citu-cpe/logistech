import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartDTO } from "generated-api";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { CUSTOMER_CART_QUERY_KEY } from "./useGetCartCustomer";
import { COMMERCE_PRODUCTS_QUERY_KEY } from "./useGetCommerceProducts";
import { OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY } from "./useGetOutgoingOrdersForCustomers";

export const useCreateOrdersForCustomer = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation((dto: CartDTO) => api.createOrdersForCustomer(dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(COMMERCE_PRODUCTS_QUERY_KEY);
      queryClient.invalidateQueries(CUSTOMER_CART_QUERY_KEY);
      queryClient.invalidateQueries(OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY);
      toast.show({
        title: "Successfully placed order",

        bgColor: "green.700",
        color: "green.50",
      });
    },
  });
};
