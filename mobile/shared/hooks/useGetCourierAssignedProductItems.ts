import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const COURIER_PRODUCT_ITEMS = ["product-items", "courier"];

export const useGetCourierAssignedProductItems = () => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: COURIER_PRODUCT_ITEMS,
    queryFn: () => api.getCourierAssignedProductItems(),
  });
};
