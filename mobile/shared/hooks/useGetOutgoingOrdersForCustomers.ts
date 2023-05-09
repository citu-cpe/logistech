import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY = [
  "orders",
  "customer",
  "outgoing",
];

export const useGetOutgoingOrdersForCustomer = () => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY,
    queryFn: () => api.getOutgoingOrdersForCustomer(),
  });
};
