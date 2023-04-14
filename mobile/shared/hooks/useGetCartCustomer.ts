import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const CUSTOMER_CART_QUERY_KEY = ["cart", "customer"];

export const useGetCartCustomer = () => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: CUSTOMER_CART_QUERY_KEY,
    queryFn: () => api.getCartCustomer(),
  });
};
