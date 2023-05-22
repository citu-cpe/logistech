import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CourierProductItemsDTO } from "generated-api";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const COURIER_PRODUCT_ITEMS = ["product-items", "courier"];

export const useGetCourierAssignedProductItems = (
  onSuccess?: (data: AxiosResponse<CourierProductItemsDTO>) => void
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: COURIER_PRODUCT_ITEMS,
    queryFn: () => api.getCourierAssignedProductItems(),
    onSuccess,
  });
};
