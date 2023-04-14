import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const CART_QUERY_KEY = ["cart"];

export const useGetCart = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => api.getCart(companyId),
    enabled: !!companyId,
  });
};
