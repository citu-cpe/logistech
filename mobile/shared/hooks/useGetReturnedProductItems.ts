import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const RETURNED_PRODUCT_ITEMS = ["product-items", "returned"];

export const useGetReturnedProductItems = () => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: RETURNED_PRODUCT_ITEMS,
    queryFn: () => api.getReturnedProductItems(),
  });
};
