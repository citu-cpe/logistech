import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { STORAGE_FACILITY_AVAILABLE_QUERY_KEY } from './useGetAvailableStorageFacilities';
import { STORAGE_FACILITY_PARTNERS_QUERY_KEY } from './useGetStorageFacilityPartnersQuery';

export const useAddStorageFacilityPartners = (companyId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (storageFacilityIds: string[]) =>
      api.addStorageFacilityPartners(companyId, { storageFacilityIds }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(STORAGE_FACILITY_AVAILABLE_QUERY_KEY);
        queryClient.invalidateQueries(STORAGE_FACILITY_PARTNERS_QUERY_KEY);
        toast({
          status: 'success',
          title: 'Successfully partnered with storage facility',
          isClosable: true,
          variant: 'subtle',
        });
      },
    }
  );
};
