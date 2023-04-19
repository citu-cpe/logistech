import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';
import { USER_QUERY_KEY } from './useGetUser';

export const useRemoveProfilePicture = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const setUser = useGlobalStore((state) => state.setUser);
  const toast = useToast();

  return useMutation(() => api.removeProfilePicture(), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(USER_QUERY_KEY);
      toast({
        status: 'success',
        title: 'Successfully removed profile picture',
        isClosable: true,
        variant: 'subtle',
      });

      setUser(data);
    },
  });
};
