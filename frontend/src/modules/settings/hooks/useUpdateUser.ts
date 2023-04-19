import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';
import { USER_QUERY_KEY } from './useGetUser';

export const useUpdateUser = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const setUser = useGlobalStore((state) => state.setUser);
  const toast = useToast();

  return useMutation((dto: UpdateUserDTO) => api.updateUser(dto), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(USER_QUERY_KEY);
      toast({
        status: 'success',
        title: 'Successfully updated user',
        isClosable: true,
        variant: 'subtle',
      });

      setUser(data);
    },
  });
};
