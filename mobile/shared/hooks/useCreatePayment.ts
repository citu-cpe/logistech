import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CreatePaymentDTO, PaymentUrlDTO } from "generated-api";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY } from "./useGetOutgoingOrdersForCustomers";
import * as WebBrowser from "expo-web-browser";

export const useCreatePayment = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((dto: CreatePaymentDTO) => api.createPayment(dto), {
    onSuccess: async (data: AxiosResponse<PaymentUrlDTO>) => {
      await WebBrowser.openBrowserAsync(data.data.url);
      queryClient.invalidateQueries(OUTGOING_ORDERS_FOR_CUSTOMER_QUERY_KEY);
    },
  });
};
