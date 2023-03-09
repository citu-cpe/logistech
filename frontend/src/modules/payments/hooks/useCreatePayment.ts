import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { CreatePaymentDTO, PaymentUrlDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useCreatePayment = () => {
  const api = useContext(ApiContext);

  return useMutation((dto: CreatePaymentDTO) => api.createPayment(dto), {
    onSuccess: (data: AxiosResponse<PaymentUrlDTO>) => {
      window.location.href = data.data.url;
    },
  });
};
